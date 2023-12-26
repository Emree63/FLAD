import { View } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export default function Loading() {

  const size = 100
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = withRepeat(withTiming(0.01, { duration: 750 }), -1, true);
  }, [progress]);


  const breatheStyleSquare = useAnimatedStyle(() => {
    const borderRange = interpolate
      (progress.value,
        [0, 1],
        [(size + 20), (size)],
      );
    return {

      width: borderRange,
      height: borderRange,
      borderRadius: borderRange / 2,
      borderWidth: size / 10,
      borderColor: "#F80404",
      shadowColor: "#F40C1C",
      shadowOpacity: 1,
      shadowRadius: 10,
    };
  });

  return (
    <View>
      <Animated.View style={[{ backgroundColor: '#B40404', justifyContent: 'center', alignItems: 'center' }, breatheStyleSquare]}>
        <Animated.Image source={require('../assets/images/icon.png')} style={[{ height: size, width: size, borderColor: '#fff', borderRadius: size / 2 }]} />
      </Animated.View>
    </View>
  );
};