import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, View } from 'react-native';

const palette = ['#6340D5', '#F6B539', '#E55C81', '#2DB88A', '#5787F2'];
const pieces = Array.from({ length: 20 }, (_, index) => {
  const angle = index * Math.PI * 2 / 20;
  const distance = 64 + (index % 4) * 19;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance * 0.65,
    spin: index % 2 ? '190deg' : '-190deg',
    color: palette[index % palette.length],
    rounded: index % 3 === 0,
  };
});

export function SessionConfetti() {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let active = true;
    const burst = Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: Platform.OS !== 'web',
    });
    void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (active && !reduceMotion) burst.start();
    }).catch(() => {
      // The completion screen also works when motion preferences are unavailable.
    });
    return () => {
      active = false;
      burst.stop();
    };
  }, [progress]);

  const opacity = progress.interpolate({
    inputRange: [0, 0.12, 0.65, 1],
    outputRange: [0, 1, 0.9, 0],
  });

  return (
    <View aria-hidden pointerEvents="none" style={styles.overlay}>
      {pieces.map(({ x, y, spin, color, rounded }, index) => (
        <Animated.View key={index} style={[
          styles.piece,
          {
            backgroundColor: color,
            borderRadius: rounded ? 4 : 1,
            height: rounded ? 8 : 12,
            opacity,
            transform: [
              { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) },
              { translateY: progress.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, y - 40, y + 35] }) },
              { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', spin] }) },
            ],
          },
        ]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  piece: { position: 'absolute', top: '48%', left: '50%', width: 8 },
});
