import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const STAGE_IMAGES = {
  1: require('@/assets/images/lion_cub_stage1.jpg'),
  2: require('@/assets/images/lion_stage2.png'),
  3: require('@/assets/images/lion_stage3.png'),
  4: require('@/assets/images/lion_stage4.png'),
  5: require('@/assets/images/lion_stage5.png'),
};

type LionAvatarProps = {
  stage: 1 | 2 | 3 | 4 | 5;
  size?: number;
  animated?: boolean;
  style?: ViewStyle;
};

export function LionAvatar({ stage, size = 160, animated = true, style }: LionAvatarProps) {
  const float = useSharedValue(0);
  const pawRotate = useSharedValue(0);
  const pawOpacity = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      float.value = withRepeat(
        withSequence(
          withTiming(-7, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      const wavePaw = () => {
        pawOpacity.value = withTiming(1, { duration: 300 });
        pawRotate.value = withRepeat(
          withSequence(
            withTiming(-25, { duration: 200, easing: Easing.out(Easing.ease) }),
            withTiming(15, { duration: 200, easing: Easing.out(Easing.ease) })
          ),
          3,
          true,
          () => {
            pawOpacity.value = withTiming(0, { duration: 300 });
          }
        );
      };

      wavePaw();
      const interval = setInterval(wavePaw, 5000);
      return () => clearInterval(interval);
    }
  }, [animated, float, pawRotate, pawOpacity]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  const pawStyle = useAnimatedStyle(() => ({
    opacity: pawOpacity.value,
    transform: [{ rotate: `${pawRotate.value}deg` }],
  }));

  const pawSize = size * 0.32;

  return (
    <Animated.View style={[{ width: size, height: size }, animated && floatStyle, style]}>
      <View style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }]}>
        <Image
          source={STAGE_IMAGES[stage]}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      </View>

      {animated && (
        <Animated.View
          style={[
            styles.pawContainer,
            {
              width: pawSize,
              height: pawSize,
              bottom: size * 0.05,
              right: -size * 0.06,
            },
            pawStyle,
          ]}
        >
          <View style={[styles.paw, { width: pawSize, height: pawSize }]}>
            <Image
              source={STAGE_IMAGES[stage]}
              style={{
                width: pawSize * 1.8,
                height: pawSize * 1.8,
                borderRadius: pawSize,
                marginTop: -pawSize * 0.3,
                marginLeft: -pawSize * 0.3,
              }}
              resizeMode="cover"
            />
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: '#FFF0D6',
  },
  pawContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paw: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#FFF0D6',
    borderWidth: 2,
    borderColor: '#E8C97A',
  },
});
