import { router, Stack, useLocalSearchParams } from 'expo-router';
import { type ComponentRef, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Card, Deck } from '@/features/library';
import { useLibrary } from '@/features/library-provider';
import { Action, colors, Page, ui } from '@/features/ui';

const blank = (id: string): Card => ({ id, question: '', answer: '' });
const maxTitleLength = 80;

export default function CreateScreen() {
  const { deckId } = useLocalSearchParams<{ deckId?: string }>();
  const { library } = useLibrary();
  const deck = library.decks.find((entry) => entry.id === deckId);
  if (deckId && !deck) {
    return (
      <Page>
        <Text style={ui.heading}>Deck unavailable</Text>
        <Action label="Back to Home" onPress={() => router.dismissTo('/')} />
      </Page>
    );
  }
  return <DeckEditor key={deck?.id ?? 'new'} deck={deck} />;
}

function DeckEditor({ deck }: { deck?: Deck }) {
  const { library, save } = useLibrary();
  const [title, setTitle] = useState(deck?.title ?? '');
  const [cards, setCards] = useState(() => deck?.cards ?? [blank('draft-1')]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const nextCard = useRef(deck ? 1 : 2);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  function changeCard(id: string, field: 'question' | 'answer', value: string) {
    setCards((draft) => draft.map((card) => card.id === id ? { ...card, [field]: value } : card));
  }

  async function submit() {
    if (busy.current) return;
    const name = title.trim();
    if (!name) return setError('Enter a deck title.');
    if (name.length > maxTitleLength && name !== deck?.title) {
      return setError(`Use ${maxTitleLength} characters or fewer for the deck title.`);
    }
    if (!cards.some((card) => card.question.trim() || card.answer.trim())) {
      return setError('Add at least one question and answer.');
    }
    const incomplete = cards.findIndex((card) => !card.question.trim() || !card.answer.trim());
    if (incomplete !== -1) return setError(`Fill in the question and answer on card ${incomplete + 1}.`);

    const duplicate = new Error('Duplicate title');
    const unavailable = new Error('Deck unavailable');
    busy.current = true;
    setSaving(true);
    setError('');
    try {
      await save((library) => {
        const existing = library.decks.find((entry) => entry.id === deck?.id);
        if (deck && !existing) throw unavailable;
        if (library.decks.some((entry) => entry.id !== existing?.id && entry.title.toLowerCase() === name.toLowerCase())) {
          throw duplicate;
        }
        const id = existing?.id ?? String(library.decks.length + 1);
        const usedIds = new Set(existing?.cards.map((card) => card.id));
        let nextId = 1;
        const updated: Deck = {
          id,
          title: name,
          cards: cards.map((card) => {
            let cardId = card.id;
            if (cardId.startsWith('draft-')) {
              do {
                cardId = `${id}-${nextId++}`;
              } while (usedIds.has(cardId));
            }
            return { id: cardId, question: card.question.trim(), answer: card.answer.trim() };
          }),
        };
        if (!existing) return { ...library, decks: [...library.decks, updated] };

        const cardsChanged = existing.cards.length !== updated.cards.length ||
          updated.cards.some((card, index) => {
            const previous = existing.cards[index];
            return card.id !== previous.id || card.question !== previous.question || card.answer !== previous.answer;
          });
        const sessions = { ...library.sessions };
        if (cardsChanged) delete sessions[id];
        return { decks: library.decks.map((entry) => entry.id === id ? updated : entry), sessions };
      });
      router.dismissTo('/');
    } catch (reason) {
      if (reason === duplicate) setError('A deck with that title already exists.');
      else if (reason === unavailable) setError('This deck is no longer available.');
      else setError('Couldn’t save your deck. Please try again.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  return (
    <Page>
      <Stack.Screen options={{ title: deck ? 'Edit deck' : 'Create deck' }} />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Text accessibilityRole="header" style={ui.title}>{deck ? 'Edit flashcards' : 'New flashcard set'}</Text>
          {deck && library.sessions[deck.id] && (
            <Text style={styles.notice}>Saving card changes restarts this deck’s paused study session.</Text>
          )}
          <View style={[ui.card, styles.fields]}>
            <Text style={ui.heading}>Deck title</Text>
            <TextInput accessibilityLabel="Deck title" value={title} onChangeText={setTitle}
              maxLength={deck && deck.title.length > maxTitleLength ? undefined : maxTitleLength}
              placeholder="e.g. Biology" placeholderTextColor={colors.muted} style={styles.input} editable={!saving} />
            <Text style={ui.body}>New titles can be up to {maxTitleLength} characters.</Text>
          </View>
          {cards.map((card, index) => (
            <View key={card.id} style={[ui.card, styles.fields]}>
              <View style={styles.cardHeader}>
                <Text style={[ui.heading, styles.cardNumber]}>Card {index + 1}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={`Remove card ${index + 1}`}
                  disabled={saving} style={({ pressed }) => [styles.remove, pressed && ui.dim]}
                  onPress={() => setCards((draft) => draft.filter((entry) => entry.id !== card.id))}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
              <Text style={ui.body}>Question</Text>
              <TextInput accessibilityLabel={`Question for card ${index + 1}`} value={card.question}
                placeholder="Question" placeholderTextColor={colors.muted} style={styles.input}
                onChangeText={(value) => changeCard(card.id, 'question', value)} multiline editable={!saving} />
              <Text style={ui.body}>Answer</Text>
              <TextInput accessibilityLabel={`Answer for card ${index + 1}`} value={card.answer}
                placeholder="Answer" placeholderTextColor={colors.muted} style={styles.input}
                onChangeText={(value) => changeCard(card.id, 'answer', value)} multiline editable={!saving} />
            </View>
          ))}
          <Action label="Add card" tone="secondary" disabled={saving} onPress={() => {
            const card = blank(`draft-${nextCard.current++}`);
            setCards((draft) => [...draft, card]);
            requestAnimationFrame(() => scroll.current?.scrollToEnd());
          }} />
          {error !== '' && <Text accessibilityRole="alert" style={ui.error}>{error}</Text>}
          <Action label={saving ? 'Saving…' : deck ? 'Save changes' : 'Save this new set'} disabled={saving} onPress={submit} />
          <Action label="Cancel" tone="secondary" disabled={saving} onPress={() => router.dismissTo('/')} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { gap: 14, paddingBottom: 20 },
  fields: { gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardNumber: { flex: 1 },
  remove: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, backgroundColor: colors.rose, borderRadius: 12 },
  removeText: { color: colors.red, fontWeight: '700' },
  notice: { ...ui.body, padding: 14, backgroundColor: colors.lemon, borderRadius: 12 },
  input: { minHeight: 48, padding: 12, color: colors.ink, fontSize: 17, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
});
