import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '@/features/library';
import { useLibrary } from '@/features/library-provider';
import { Action, colors, Page, ui } from '@/features/ui';

const deckAccents = [colors.pale, colors.mint, colors.lemon, colors.rose];

export default function HomeScreen() {
  const { library } = useLibrary();
  const [selected, setSelected] = useState<Deck>();
  const countLabel = (deck: Deck) => `${deck.cards.length} ${deck.cards.length === 1 ? 'card' : 'cards'}`;

  function openStudy(deck: Deck) {
    setSelected(undefined);
    router.push({ pathname: '/study/[deckId]', params: { deckId: deck.id } });
  }

  return (
    <Page>
      <FlatList
        data={library.decks}
        keyExtractor={(deck) => deck.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text accessibilityRole="header" style={[ui.title, styles.headerTitle]}>Your decks</Text>
              <View accessible={false} aria-hidden style={styles.stack}>
                <View style={styles.stackBack} />
                <View style={styles.stackFront}><View style={styles.stackMark} /></View>
              </View>
            </View>
            <Action label="Create new deck" onPress={() => router.push('/create')} />
          </View>
        }
        ListEmptyComponent={<Text style={[ui.card, ui.body]}>Create your first deck to start studying.</Text>}
        renderItem={({ item, index }) => (
          <Pressable accessibilityRole="button" onPress={() => setSelected(item)}
            style={({ pressed }) => [ui.card, styles.deck, pressed && ui.dim]}>
            <View aria-hidden style={[styles.deckAccent, { backgroundColor: deckAccents[index % deckAccents.length] }]} />
            <View style={styles.deckInfo}>
              <Text style={ui.heading}>{item.title}</Text>
              <Text style={ui.body}>{countLabel(item)}</Text>
            </View>
            <Text aria-hidden style={styles.chevron}>›</Text>
          </Pressable>
        )}
      />
      <Modal visible={selected !== undefined} transparent animationType="fade"
        onRequestClose={() => setSelected(undefined)}>
        <View style={styles.overlay}>
          {selected && (
            <View accessibilityViewIsModal style={[ui.card, styles.dialog]}>
              <Text accessibilityRole="header" style={ui.heading}>{selected.title}</Text>
              <Text style={ui.body}>{countLabel(selected)}</Text>
              <Action label={library.sessions[selected.id] ? 'Resume studying' : 'Start studying'}
                onPress={() => openStudy(selected)} />
              <Action label="Edit deck" tone="secondary" onPress={() => {
                setSelected(undefined);
                router.push({ pathname: '/create', params: { deckId: selected.id } });
              }} />
              <Action tone="secondary" label="Close" onPress={() => setSelected(undefined)} />
            </View>
          )}
        </View>
      </Modal>
    </Page>
  );
}

const styles = StyleSheet.create({
  header: { gap: 16, backgroundColor: colors.pale, padding: 20, borderRadius: 26, marginBottom: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { flex: 1 },
  stack: { width: 64, height: 56 },
  stackBack: { position: 'absolute', right: 7, top: 4, width: 43, height: 42, borderRadius: 10, backgroundColor: colors.lemon, transform: [{ rotate: '14deg' }] },
  stackFront: { position: 'absolute', left: 2, bottom: 3, width: 43, height: 42, borderRadius: 10, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-12deg' }] },
  stackMark: { width: 18, height: 5, borderRadius: 3, backgroundColor: colors.purple },
  list: { gap: 12, paddingBottom: 20 },
  deck: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deckAccent: { width: 12, minHeight: 42, alignSelf: 'stretch', borderRadius: 6 },
  deckInfo: { flex: 1, gap: 4 },
  chevron: { fontSize: 28, color: colors.purple },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#19172288' },
  dialog: { width: '100%', maxWidth: 420, gap: 12 },
});
