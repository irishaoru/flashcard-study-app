import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { grade, type Deck, type Session } from '@/features/library';
import { useLibrary } from '@/features/library-provider';
import { SessionConfetti } from '@/features/session-confetti';
import { Action, colors, Page, ui } from '@/features/ui';

export default function StudyRoute() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const { library } = useLibrary();
  const deck = library.decks.find((entry) => entry.id === deckId);
  if (!deck || deck.cards.length === 0) {
    return (
      <Page>
        <Text style={ui.heading}>Deck unavailable</Text>
        <Action label="Back to Home" onPress={() => router.dismissTo('/')} />
      </Page>
    );
  }
  return <StudyScreen key={deck.id} deck={deck} />;
}

function StudyScreen({ deck }: { deck: Deck }) {
  const { library, save } = useLibrary();
  const [session, setSession] = useState<Session | undefined>(() => library.sessions[deck.id] ?? {
    round: 1, queue: deck.cards.map((card) => card.id), index: 0, missed: [], revealed: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const card = session && deck.cards.find((entry) => entry.id === session.queue[session.index]);

  async function store(next: Session | undefined, exit = false) {
    if (busy.current) return;
    busy.current = true;
    setSaving(true);
    setError('');
    try {
      await save((data) => {
        const sessions = { ...data.sessions };
        if (next) sessions[deck.id] = next;
        else delete sessions[deck.id];
        return { ...data, sessions };
      });
      setSession(next);
      if (exit) router.dismissTo('/');
    } catch {
      setError('Couldn’t save your study progress. Please try again.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  function flip() {
    if (session && !busy.current) setSession({ ...session, revealed: !session.revealed });
  }

  const exitLabel = 'Exit this study session';
  const goHome = () => router.dismissTo('/');

  return (
    <Page>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={ui.title}>{deck.title}</Text>
        {session && card ? (
          <>
            <Text style={ui.body}>Round {session.round} · Card {session.index + 1} of {session.queue.length}</Text>
            <View aria-hidden style={styles.track}>
              <View style={[styles.progress, { width: `${(session.index + 1) / session.queue.length * 100}%` }]} />
            </View>
            <Pressable accessibilityRole="button" disabled={saving} onPress={flip}
              style={({ pressed }) => [ui.card, styles.flashcard, session.revealed && styles.revealed, pressed && ui.dim]}>
              <Text style={styles.face}>{session.revealed ? 'Answer' : 'Question'}</Text>
              <Text style={styles.cardText}>{session.revealed ? card.answer : card.question}</Text>
              <Text style={ui.body}>{session.revealed ? 'Tap to see question' : 'Tap to reveal answer'}</Text>
            </Pressable>
            {session.revealed && <>
              <Action label="Got it!" tone="green" disabled={saving} onPress={() => store(grade(session, true))} />
              <Action label="Put back in the review pile" tone="red" disabled={saving} onPress={() => store(grade(session, false))} />
            </>}
            <Action label={exitLabel} tone="secondary" disabled={saving} onPress={() => store(session, true)} />
            <Action label="End study session" tone="secondary" disabled={saving} onPress={() => store(undefined, true)} />
          </>
        ) : !session ? (
          <>
            <View style={[ui.card, styles.complete]}>
              <SessionConfetti />
              <Text accessibilityRole="header" style={ui.title}>Session complete</Text>
            </View>
            <Action label="Complete session" onPress={goHome} />
          </>
        ) : (
          <>
            <Text accessibilityRole="alert" style={ui.error}>Couldn’t open this study session.</Text>
            <Action label="End study session" disabled={saving} onPress={() => store(undefined, true)} />
          </>
        )}
        {error !== '' && <Text accessibilityRole="alert" style={ui.error}>{error}</Text>}
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, paddingBottom: 20 },
  track: { backgroundColor: colors.pale, height: 7, borderRadius: 4, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: colors.purple, borderRadius: 4 },
  flashcard: { minHeight: 280, justifyContent: 'space-between', alignItems: 'center', gap: 18, padding: 24, borderBottomWidth: 5 },
  revealed: { backgroundColor: colors.mint, borderColor: '#B4E5D1' },
  face: { color: colors.navy, backgroundColor: colors.lemon, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, fontSize: 16, fontWeight: '700' },
  cardText: { textAlign: 'center', fontSize: 28, color: colors.ink, fontWeight: '700' },
  complete: { backgroundColor: colors.mint, minHeight: 150, justifyContent: 'center', paddingVertical: 28 },
});
