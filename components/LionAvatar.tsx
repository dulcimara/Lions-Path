import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const STAGE_IMAGES = {
  1: require('@/assets/images/lion_cub_stage1.jpg'),
  2: require('@/assets/images/lion_stage2.png'),
  3: require('@/assets/images/lion_stage3.png'),
  4: require('@/assets/images/lion_stage4.png'),
  5: require('@/assets/images/lion_stage5.png'),
};

type LionAvatarProps = { stage: 1 | 2 | 3 | 4 | 5; size?: number; animated?: boolean; style?: ViewStyle };

export function LionAvatar({ stage, size = 160, animated = true, style }: LionAvatarProps) {
  const float = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      float.value = withRepeat(
        withSequence(withTiming(-7, { duration: 1600 }), withTiming(0, { duration: 1600 })),
        -1,
        true
      );
    }
  }, [animated, float]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: float.value }] }));

  return (
    <Animated.View style={[{ width: size, height: size }, animated && animStyle, style]}>
      <View style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }]}>
        <Image
          source={STAGE_IMAGES[stage]}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: '#FFF0D6',
  },
});
