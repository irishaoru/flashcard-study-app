import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const colors = {
  background: '#FAF8F2', card: '#FFFFFF', ink: '#211C35', muted: '#57526B',
  navy: '#29204E', purple: '#6340D5', border: '#E6DEF4', pale: '#EFE6FF',
  green: '#187050', red: '#A12F49', rose: '#FFE9EE', lemon: '#FFF1B7', mint: '#DDF7EC',
};

export function Page({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={ui.screen}>
      <View style={ui.page}>{children}</View>
    </SafeAreaView>
  );
}

type ActionProps = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary' | 'green' | 'red';
  disabled?: boolean;
};

export function Action({ label, onPress, tone = 'primary', disabled }: ActionProps) {
  const secondary = tone === 'secondary';
  const backgroundColor = tone === 'green' ? colors.green : tone === 'red' ? colors.red :
    secondary ? colors.pale : colors.purple;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [ui.action, { backgroundColor }, (pressed || disabled) && ui.dim]}>
      <Text style={[ui.actionText, secondary && ui.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: colors.navy },
  heading: { fontSize: 20, fontWeight: '700', color: colors.navy },
  body: { fontSize: 16, color: colors.muted },
  error: { fontSize: 16, color: colors.red },
  card: { backgroundColor: colors.card, borderRadius: 22, borderWidth: 1, borderColor: colors.border, padding: 18 },
  action: { minHeight: 48, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  secondaryText: { color: colors.navy },
  dim: { opacity: 0.72 },
});
