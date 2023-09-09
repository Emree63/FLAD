import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, useColorScheme } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import normalize from '../components/Normalize';

// @ts-ignore
export default function NextButton({ percentage, scrollTo }) {
    const style = useColorScheme() == 'light' ? colorsLight : colorsDark;

    const size = normalize(148);
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumFerence = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);
    // @ts-ignore
    const animation = (toValue) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true
        }).start()
    }

    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener(
            (value) => {
                const strokeDashoffset = circumFerence - (circumFerence * value.value) / 100;

                if (progressRef?.current) {
                    // @ts-ignore
                    progressRef.current.setNativeProps({
                        strokeDashoffset,
                    });
                }

            },
            // @ts-ignore
            [percentage]

        );

        return () => {
            progressAnimation.removeAllListeners();
        };

    }, []);

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={center}>
                    <Circle stroke={style.Text} cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
                    <Circle
                        ref={progressRef}
                        stroke="#F80404"
                        fill={style.body}
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumFerence}
                    />
                </G>
            </Svg>
            <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={0.6}>
                <AntDesign name="arrowright" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        position: 'absolute',
        backgroundColor: '#F80404',
        borderRadius: 100,
        padding: normalize(23)
    }
})
