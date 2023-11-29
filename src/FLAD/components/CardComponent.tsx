import { View, Image, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import Animated, { interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import normalize from './Normalize';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface CardProps {
  image: any;
  onSwipe: (direction: "left" | "right" | "down") => void;
}

type ContextType = {
  translateX: number;
  translateY: number;
};

export default function CardComponent(props: CardProps) {

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: () => {

      if (translateX.value > SCREEN_WIDTH / 2) {
        runOnJS(props.onSwipe)("right");
      } else if (translateX.value < -SCREEN_WIDTH / 2) {
        runOnJS(props.onSwipe)("left");
      } else if (translateY.value > SCREEN_HEIGHT / 2) {
        runOnJS(props.onSwipe)("down");
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const opacityRightIcon = useAnimatedStyle(() => {
    const horizontal = interpolate
      (translateX.value,
        [-SCREEN_WIDTH / 4, 20, SCREEN_WIDTH / 4],
        [0, 0, 1]);

    const vertical = interpolate
      (translateY.value,
        [20, SCREEN_HEIGHT / 4],
        [1, 0.2]);

    return {
      opacity: horizontal * vertical,
    };
  });

  const opacityLeftIcon = useAnimatedStyle(() => {
    const horizontal = interpolate
      (translateX.value,
        [-SCREEN_WIDTH / 4, -20, SCREEN_WIDTH / 4],
        [1, 0, 0]);

    const vertical = interpolate
      (translateY.value,
        [20, SCREEN_HEIGHT / 4],
        [1, 0.2]);

    return {
      opacity: horizontal * vertical,
    };
  });

  const opacityDownIcon = useAnimatedStyle(() => {
    const vertical = interpolate
      (translateY.value,
        [20, SCREEN_HEIGHT / 2],
        [0, 1]);

    const horizontal = interpolate
      (translateX.value,
        [-SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4],
        [0.5, 1, 0.5]);

    return {
      opacity: vertical * horizontal,
    };
  });

  const opacityHorizontalBackground = useAnimatedStyle(() => {
    const value = interpolate
      (translateX.value,
        [-SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4],
        [0.27, 0, 0.27]);
    return {
      opacity: value,
    };
  });

  const opacityDownBackground = useAnimatedStyle(() => {
    const value = interpolate
      (translateY.value,
        [0, SCREEN_HEIGHT / 5],
        [0, 0.28]);
    return {
      opacity: value,
    };
  });

  const horizontalThreshold = SCREEN_WIDTH * 0.65;

  const styleCardsNew = useAnimatedStyle(() => {
    const factor = 1;
    const rot = interpolate
      (translateX.value,
        [0, factor * horizontalThreshold],
        [0, 15],
      );

    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rot}deg` },
      ]
    };
  });

  return (
    <View>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styleCardsNew, styles.container]}>
          <Animated.View style={[styles.image, styles.backgroundEffect, opacityHorizontalBackground]} />
          <Animated.View style={[styles.image, styles.backgroundEffect, opacityDownBackground]} />
          <Image source={{ uri: props.image }} style={[styles.image]} />
          <Animated.View style={[styles.iconContainer, opacityLeftIcon]}>
            <Image style={{ alignSelf: "center" }}
              source={require('../assets/images/dislike_icon.png')}
            />
          </Animated.View>
          <Animated.View style={[styles.iconContainer, opacityRightIcon]} >
            <Image style={{ alignSelf: "center" }}
              source={require('../assets/images/like_icon.png')}
            />
          </Animated.View>
          <Animated.View style={[styles.iconContainer, opacityDownIcon]}>
            <Image style={styles.icon}
              source={require('../assets/images/discovery_icon.png')}
            />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};


const styles = StyleSheet.create({
  image: {
    borderRadius: 24,
    resizeMode: 'stretch',
    height: normalize(420),
    width: normalize(420),
  },
  backgroundEffect: {
    backgroundColor: 'black',
    elevation: 100,
    position: "absolute",
    borderWidth: 8,
    borderColor: '#FFF',
    zIndex: 1
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
    elevation: 100,
    zIndex: 1
  },
  icon: {
    alignSelf: "center",
    width: 126.27,
    height: 118.64,
  }
});