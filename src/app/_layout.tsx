import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { LibraryProvider } from '@/features/library-provider';
import { colors } from '@/features/ui';

export default function RootLayout() {
  return (
    <LibraryProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: '#FFFFFF',
        contentStyle: { backgroundColor: colors.background },
      }}>
        <Stack.Screen name="index" options={{ title: 'Flashcards' }} />
        <Stack.Screen name="create" options={{ title: 'Create deck' }} />
        <Stack.Screen name="study/[deckId]" options={{ title: 'Study', headerBackVisible: false, gestureEnabled: false }} />
      </Stack>
    </LibraryProvider>
  );
}
