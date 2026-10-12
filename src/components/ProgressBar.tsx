import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
export function ProgressBar({
  percent,
  inverted = false,
}: {
  percent: number;
  inverted?: boolean;
}) {
  const t = useTheme();
  const value = useSharedValue(0);
  useEffect(() => {
    value.value = withTiming(percent, {
      duration: 450,
      reduceMotion: ReduceMotion.System,
    });
  }, [percent, value]);
  const style = useAnimatedStyle(() => ({ width: `${value.value}%` }));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={{
        height: 6,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: inverted ? '#FFFFFF30' : t.border,
      }}
    >
      <Animated.View
        style={[
          {
            height: 6,
            borderRadius: 4,
            backgroundColor: inverted ? '#C5F5A4' : t.primary,
          },
          style,
        ]}
      />
    </View>
  );
}
