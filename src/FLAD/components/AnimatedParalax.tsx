import { View } from "react-native";
import Animated, { interpolate, SensorType, useAnimatedSensor, useAnimatedStyle } from "react-native-reanimated";

const halfPi = Math.PI / 2;

export default function AnimatedParalax() {
    const sensor = useAnimatedSensor(SensorType.ROTATION);
    const styleAniamatedImage = useAnimatedStyle(() => {
        const { pitch, roll } = sensor.sensor.value;
        const verticalAxis = interpolate(
            pitch,
            [-halfPi, halfPi],
            [-25, 25]
        )
        const horizontalAxis = interpolate(
            roll,
            [-halfPi * 2, halfPi * 2],
            [-35, 35]
        )
        return {
            top: verticalAxis,
            left: horizontalAxis,
        };

    })
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <Animated.Image
                source={{
                    uri: spot.sourceUrl,
                }}
                style={[
                    {
                        width: 370,
                        height: 370,
                        borderRadius: 24,
                        resizeMode: 'stretch',
                    }, styleAniamatedImage
                ]}
            />
        </View>

    );
};
