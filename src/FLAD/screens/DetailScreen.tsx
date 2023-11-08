import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Pressable, Share, Alert } from "react-native";
import Animated, { interpolate, SensorType, useAnimatedSensor, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Audio } from 'expo-av';
import { useEffect, useState } from "react";
import normalize from '../components/Normalize';
import Music from "../models/Music";
import { LinearGradient } from "expo-linear-gradient";
import { Feather as Icon } from "@expo/vector-icons";
import { MusicServiceProvider } from "../models/MusicServiceProvider";
import { HorizontalFlatList } from "../components/HorizontalFlatList";
import { LittleCard } from "../components/littleCard";

const halfPi = Math.PI / 2;

//@ts-ignore
export default function DetailScreen({ route }) {
    const music: Music = route.params.music;
    const [currentspot] = useState(music);
    const [simularMusic, setSimularMusic] = useState<Music[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);

    const navigator = useNavigation();


    useEffect(() => {
        getSimilarTrack();
    }, []);
    const getSimilarTrack = async () => {
        const simularMusic = await MusicServiceProvider.musicService.getSimilarTracks(currentspot.id);
        setSimularMusic(simularMusic);
    }

    const handlePlaySound = async () => {
        if (sound === null) {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: music.trackPreviewUrl },
                { shouldPlay: true }
            );
            //setSound(newSound);
            setIsPlaying(true);

        } else {
            setIsPlaying(true);
            //@ts-ignore
            await sound.playAsync();
        }
    };

    const handleStopSound = async () => {
        if (sound !== null) {
            setIsPlaying(false);

            //@ts-ignore
            await sound.stopAsync();
        }
    };
    useEffect(() => {
        return sound ? () => {
            console.log('Unloading Sound');
            //@ts-ignore
            sound.unloadAsync();
        }
            : undefined;
    }, [sound]);

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    music.url,
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    const addToPlaylist = async () => {
        MusicServiceProvider.musicService.addToPlaylist(music.id);
    };

    const sensor = useAnimatedSensor(SensorType.ROTATION);
    const styleAniamatedImage = useAnimatedStyle(() => {
        const { pitch, roll } = sensor.sensor.value;
        const verticalAxis = interpolate(
            pitch,
            [-halfPi * 2, halfPi * 2],
            [-45, 45]
        )
        const horizontalAxis = interpolate(
            roll,
            [-halfPi * 2, halfPi * 2],
            [-45, 45]
        )
        return {
            top: withSpring(verticalAxis),
            left: withSpring(horizontalAxis),
        };

    })
    return (
        <View style={styles.body}>
            <View style={styles.backgroundSection}>
                <Image
                    blurRadius={133}
                    style={styles.back_drop}
                    source={{
                        uri: currentspot.cover,
                    }}
                ></Image>
                <LinearGradient style={styles.gradientFade}
                    colors={['rgba(56,56,56,0)', 'rgba(14,14,14,1)']}>
                </LinearGradient>
            </View>
            <View style={styles.background1}>
                <ScrollView style={styles.list} showsVerticalScrollIndicator={false} scrollEventThrottle={4}>
                    <View style={styles.section1}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View>

                                <Animated.Image
                                    source={{
                                        uri: currentspot.cover,
                                    }}
                                    style={[
                                        {
                                            width: normalize(429),
                                            height: normalize(429),
                                            borderRadius: 24,
                                            resizeMode: 'stretch',
                                        }, styleAniamatedImage

                                    ]}
                                />
                            </View>
                            <View style={{ marginTop: 45, flex: 1, flexDirection: 'row', }}>
                                <View>

                                </View>
                                <TouchableOpacity activeOpacity={0.5} onPressIn={handlePlaySound}
                                    onPressOut={handleStopSound} style={{
                                        backgroundColor: '#F80404',
                                        borderRadius: 100,
                                        padding: normalize(23)

                                    }}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>

                        <TouchableOpacity onPress={addToPlaylist} activeOpacity={0.6} style={{
                            flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: 180,
                            height: 64, borderRadius: 8, opacity: 0.86, backgroundColor: '#0B0606',
                        }}>
                            <Text style={{ fontSize: normalize(16), fontWeight: "700", color: '#FFFFFF' }}>Dans ma collection</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onShare} activeOpacity={0.6} style={{
                            flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: 180,
                            height: 64, borderRadius: 8, opacity: 0.86, backgroundColor: '#0B0606',
                        }}>
                            <Icon name="share" size={24} color="#FFFF"></Icon>
                            {/* <FontAwesome name="bookmark" size={24} color="#FF0000"  ></FontAwesome> */}
                            <Text style={{ fontSize: normalize(16), fontWeight: "700", color: '#FFFFFF' }}>Partager cette music</Text>
                        </TouchableOpacity>

                    </View>
                    {simularMusic.length !== 0 && (
                        <HorizontalFlatList title={'Similar'} data={simularMusic}>
                            {(props) => (
                                <Pressable
                                onPress={() => {
                                    // @ts-ignore
                                        navigator.replace("Detail", { "music": props }) }} >
                                    <LittleCard  data={props} />
                                </Pressable>
                            )}
                        </HorizontalFlatList>
                    )}

                </ScrollView>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    mainSafeArea: {
        flex: 1,
        backgroundColor: "#141414",
    },
    body: {
        backgroundColor: "#0E0E0E"
    },
    backgroundSection: {
        height: "100%",
        width: "100%",
        position: "absolute"
    },
    back_drop: {
        height: "160%",
        width: '430%',
        position: "absolute",
    },
    gradientFade: {
        height: "100%",
    },
    background1: {
        height: '100%',
        width: '100%',
    },
    list: {
        height: "100%"
    },
    section1: {
        paddingHorizontal: 25
    }
})