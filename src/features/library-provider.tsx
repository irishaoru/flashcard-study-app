import { createContext, type PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';

import type { Library } from './library';
import Storage from './storage';
import { Action, Page, ui } from './ui';
import { ActivityIndicator, Text } from 'react-native';

const storageKey = 'flashcard-library.v1';
const empty: Library = { decks: [], sessions: {} };
type Update = (library: Library) => Library;
const LibraryContext = createContext<{ library: Library; save: (update: Update) => Promise<void> } | null>(null);

export function LibraryProvider({ children }: PropsWithChildren) {
  const [library, setLibrary] = useState<Library>();
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const current = useRef(empty);
  const pending = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const raw = await Storage.getItem(storageKey);
        const data: Library = raw === null ? empty : JSON.parse(raw);
        if (!data || !Array.isArray(data.decks) || !data.sessions || typeof data.sessions !== 'object') {
          throw new Error('Invalid library data');
        }
        if (active) {
          current.current = data;
          setLibrary(data);
        }
      } catch {
        if (active) setLoadFailed(true);
      }
    }
    void load();
    return () => { active = false; };
  }, [attempt]);

  function save(update: Update) {
    const write = pending.current.then(async () => {
      const next = update(current.current);
      await Storage.setItem(storageKey, JSON.stringify(next));
      current.current = next;
      setLibrary(next);
    });
    pending.current = write.catch(() => {});
    return write;
  }

  if (!library) {
    return (
      <Page>
        {loadFailed ? <>
          <Text accessibilityRole="alert" style={ui.body}>Couldn’t open your saved decks.</Text>
          <Action label="Try again" onPress={() => { setLoadFailed(false); setAttempt(attempt + 1); }} />
        </> : <ActivityIndicator accessibilityLabel="Loading decks" color={ui.title.color} />}
      </Page>
    );
  }
  return <LibraryContext.Provider value={{ library, save }}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('LibraryProvider is required');
  return context;
}
