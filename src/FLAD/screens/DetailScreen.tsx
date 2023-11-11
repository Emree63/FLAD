import { useIsFocused, useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Share, Alert, SafeAreaView, Linking, FlatList, ActivityIndicator } from "react-native";
import Animated, { interpolate, SensorType, useAnimatedSensor, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Audio } from 'expo-av';
import { useEffect, useState } from "react";
import normalize from '../components/Normalize';
import Music from "../model/Music";
import { LinearGradient } from "expo-linear-gradient";
import { MusicServiceProvider } from "../model/MusicServiceProvider";
import { SimilarMusic } from "../components/SimilarMusicComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Artist from "../model/Artist";
import { BlurView } from 'expo-blur';

const halfPi = Math.PI / 2;

//@ts-ignore
export default function DetailScreen({ route }) {
    const item: Music = route.params.music;
    const [simularMusic, setSimularMusic] = useState<Music[]>([]);
    const [artistImage, setArtistImage] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [addedToPlaylist, setAddedToPlaylist] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>();
    const [loading, setLoading] = useState(true);

    const navigator = useNavigation();

    useEffect(() => {
        getSimilarTrack();
        getArtistImage();

        if (item.trackPreviewUrl) {
            loadMusic();
        }

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
          };
    }, []);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused && sound) {
            sound.stopAsync();
            setIsPlaying(false);
        }
    }, [isFocused]);

    const loadMusic = async () => {
        const { sound } = await Audio.Sound.createAsync(
            { uri: item.trackPreviewUrl },
            { shouldPlay: isPlaying },
            onPlaybackStatusUpdate
        );
        setSound(sound);
    };

    const getArtistImage = async () => {
        const image = await MusicServiceProvider.musicService.getImageArtistWithId(item.artists[0].id);
        setArtistImage(image);
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.didJustFinish) {
            setIsPlaying(false);
        }
    };

    const play = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.replayAsync();
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const getSimilarTrack = async () => {
        try {
            const simularMusic = await MusicServiceProvider.musicService.getSimilarTracks(item.id);
            setSimularMusic(simularMusic);
        } finally {
            setLoading(false);
        }
    }

    const onShare = async () => {
        try {
            await Share.share({
                message:
                    item.url,
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    const addToPlaylist = async () => {
        MusicServiceProvider.musicService.addToPlaylist(item.id);
        setAddedToPlaylist(true);
    };

    const sensor = useAnimatedSensor(SensorType.ROTATION);
    const styleAnimatedImage = useAnimatedStyle(() => {
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

    const insets = useSafeAreaInsets();

    const styles = StyleSheet.create({
        mainSafeArea: {
            height: '100%',
            width: '100%',
            paddingTop: insets.top
        },
        backgroundSection: {
            height: "100%",
            width: "100%",
            position: "absolute"
        },
        back_drop: {
            height: "100%",
            width: '100%',
            position: "absolute",
        },
        gradientFade: {
            height: "100%",
        },
        card: {
            alignItems: 'center'
        },
        cardCover: {
            width: normalize(390),
            height: normalize(390),
            borderRadius: 16,
            resizeMode: 'stretch'
        },
        section1: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: "10%",
            marginBottom: "4%",
            marginTop: "5%"
        },
        section2: {
            flex: 1
        },
        section3: {
            flexDirection: "row",
        },
        similarTitle: {
            color: "#FFF",
            paddingLeft: "8%",
            fontSize: normalize(28),
            fontWeight: "600",
            paddingBottom: normalize(15)
        },
        title: {
            maxWidth: "90%",
            fontSize: normalize(30),
            fontWeight: "bold",
            color: "white"
        },
        playButton: {
            height: normalize(60),
            width: normalize(60),
            backgroundColor: "#E70E0E",
            borderRadius: 30
        },
        imagePlayButton: {
            width: normalize(40),
            height: normalize(40)
        },
        bodyPlayButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        artist: {
            maxWidth: "40%",
            fontWeight: "bold",
            color: "white",
            fontSize: normalize(17),
            paddingLeft: normalize(5)
        },
        date: {
            fontWeight: "400",
            color: "white",
            fontSize: normalize(17)
        },
        buttonArtist: {
            flexDirection: "row",
            alignItems: "center",
        },
        saveButton: {
            backgroundColor: '#3F3F3F',
            width: normalize(180),
            height: normalize(50),
            padding: 10,
            borderRadius: 8,
            marginRight: normalize(10),
            flexDirection: "row",
            alignItems: "center"
        },
        shareButton: {
            backgroundColor: '#3F3F3F',
            width: normalize(180),
            height: normalize(50),
            marginLeft: normalize(10),
            padding: 10,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center"
        },
        saveIcon: {
            width: normalize(14.7),
            height: normalize(21),
            marginLeft: normalize(9)
        },
        shareIcon: {
            width: normalize(25),
            height: normalize(25),
            marginBottom: normalize(5)
        },
        saveText: {
            fontSize: normalize(11),
            paddingLeft: normalize(9),
            color: "white",
            fontWeight: "bold"
        },
        shareText: {
            fontSize: normalize(11),
            paddingLeft: normalize(5),
            color: "white",
            fontWeight: "bold"
        },
        explicitImage: {
            marginLeft: normalize(5),
            width: normalize(16),
            height: normalize(16)
        },
        options: {
            flexDirection: "row",
            alignItems: "center",
            paddingTop: normalize(15),
            justifyContent: "center",
            paddingHorizontal: normalize(20)
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },

    });

    return (
        <View>
            <View style={styles.backgroundSection}>

                <Image
                    style={styles.back_drop}
                    source={{
                        uri: item.cover,
                    }}
                />
                <View style={styles.overlay} />
                <BlurView
                    style={styles.gradientFade}
                    intensity={70}
                >
                    <LinearGradient
                        colors={['rgba(56,0,56,0)', 'rgba(14,14,14,1)']}
                        style={styles.gradientFade}
                    />
                </BlurView>
            </View>
            <SafeAreaView style={styles.mainSafeArea}>
                <ScrollView>

                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => { Linking.openURL(item.url); }}>
                            <Animated.Image source={{ uri: item.cover }} style={[styles.cardCover, styleAnimatedImage]} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section1}>
                        <View style={styles.section2}>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => { Linking.openURL(item.url); }}>
                                <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                                {item.explicit && (
                                    <Image style={styles.explicitImage} source={require('../assets/images/explicit_icon.png')} />

                                )}
                            </TouchableOpacity>
                            <View style={styles.section3}>
                                <TouchableOpacity style={styles.buttonArtist} onPress={() => { Linking.openURL(item.artists[0].url); }}>
                                    {artistImage && (
                                        <Image style={{ width: normalize(30), height: normalize(30), borderRadius: 30 }} source={{ uri: artistImage }} />
                                    )}
                                    <Text numberOfLines={1} style={styles.artist}>{item.artists.map((artist: Artist) => artist.name).join(', ')}</Text>
                                    <Text style={styles.date}> - {item.date} - {Math.floor(item.duration / 60)} min {Math.floor(item.duration % 60)} s</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {item.trackPreviewUrl && (
                            <TouchableOpacity style={styles.playButton} onPress={play}>
                                <View style={styles.bodyPlayButton}>
                                    <Image style={styles.imagePlayButton} source={isPlaying ? require('../assets/images/play_icon.png') : require('../assets/images/pause_icon.png')} />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.options}>
                        <TouchableOpacity onPress={addToPlaylist}>
                            <View style={styles.saveButton}>
                                <Image style={styles.saveIcon} source={addedToPlaylist ? require('../assets/images/save_icon_full.png') : require('../assets/images/save_icon.png')} />
                                <Text style={styles.saveText}>Dans ma collection</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onShare}>
                            <View style={styles.shareButton}>
                                <Image style={styles.shareIcon} source={require('../assets/images/share_icon.png')} />
                                <Text style={styles.shareText}>Partager cette music</Text>
                            </View>
                        </TouchableOpacity>
                    </View>



                    <View style={{ paddingTop: normalize(25) }}>
                        <Text style={styles.similarTitle} >Similaire</Text>
                        {loading ? (
                            <ActivityIndicator size="large" style={{ paddingTop: normalize(14) }} color="#FFF" />
                        ) :
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={simularMusic}
                                horizontal={true}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // @ts-ignore
                                            navigator.replace("Detail", { "music": item })
                                        }} >
                                        <SimilarMusic music={item} />
                                    </TouchableOpacity>
                                }
                            />}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};