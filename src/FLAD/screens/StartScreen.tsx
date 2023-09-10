import React, { useState, useRef } from 'react';
import { Modal, View, StyleSheet, useColorScheme, Text, FlatList, Animated, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import normalize from '../components/Normalize';
import OnboardingItem from '../components/OnboardingComponent';
import Paginator from '../components/Paginator';
import NextButton from '../components/NextButton';
import slides from '../data/slides';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';

export default function StartScreen() {
    const style = useColorScheme() == 'light' ? colorsLight : colorsDark;
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const navigation = useNavigation();

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handleModal = () => setIsModalVisible(() => !isModalVisible);
    // @ts-ignore
    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            // @ts-ignore
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            setIsModalVisible(() => !isModalVisible);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: style.body
        },
        imageLogo: {
            width: normalize(324),
            height: normalize(162),
            marginBottom: '25%'
        },
        balise: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: normalize(110)
        },
        closeButtonCircle: {
            backgroundColor: 'gray',
            opacity: 0.4,
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 10,
            right: 10
        },
        modalContent: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        backgroundImage: {
            width: '103%',
            height: '100%',
        },
        imageButton: {
            width: 20,
            height: 20
        },
        versionText: {
            position: 'absolute',
            top: 50,
            right: 10,
            color: 'gray',
            fontWeight: 'bold',
            fontSize: normalize(17)
        },
        buttonConnection: {
            width: 262,
            height: 57,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#24CF5F',
            borderRadius: 11,
            borderColor: '#68F097',
            borderWidth: 1,
            marginBottom: 12
        },
        buttonInscription: {
            width: 262,
            height: 57,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#DA1D1D',
            borderRadius: 11,
            borderColor: '#F40C1C',
            borderWidth: 1,
            marginBottom: 220
        },
        text: {
            fontWeight: 'bold',
            color: 'white',
            fontSize: normalize(18)
        },
        button2Connection: {
            width: '100%',
            height: normalize(92),
            backgroundColor: '#232123',
            borderTopColor: '#3C3C3C',
            borderTopWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: normalize(0)
        },
        mascot: {
            width: normalize(130),
            height: normalize(130),
            position: 'absolute',
            bottom: normalize(90),
            right: normalize(0)
        }
    })


    return (
        // @ts-ignore
        <View style={styles.container}>
            <View style={styles.balise}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
                <Paginator data={slides} scrollX={scrollX} />
                <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />
            </View>
            <Modal animationType="slide" visible={isModalVisible} presentationStyle={'pageSheet'}>
                <View style={styles.modalContent}>
                    <ImageBackground source={require("../assets/images/background_start.png")} style={styles.backgroundImage}>
                        <View style={styles.modalView}>
                            <Text style={styles.versionText}>
                                v2.0
                            </Text>
                            <TouchableOpacity onPress={handleModal} style={styles.closeButtonCircle}>
                                <View>
                                    <Image source={require("../assets/images/cross_icon.png")} style={styles.imageButton} />
                                </View>
                            </TouchableOpacity>
                            <Image source={require("../assets/images/flad_logo.png")} style={styles.imageLogo} />
                            <TouchableOpacity
                                style={styles.buttonConnection}
                                onPress={() => {
                                    handleModal();
                                    // @ts-ignore
                                    navigation.navigate('Login');
                                }}>
                                <Text style={styles.text}>CONTINUER AVEC SPOTIFY</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonInscription}
                                // @ts-ignore
                                onPress={() => { handleModal(); navigation.navigate('Register'); }}
                            >
                                <Text style={styles.text}>S’INSCRIRE MAINTENANT</Text>
                            </TouchableOpacity>
                            <Image source={require("../assets/images/flady.gif")} style={styles.mascot} />
                            <TouchableOpacity
                                style={styles.button2Connection}
                                // @ts-ignore
                                onPress={() => { handleModal(); navigation.navigate('Login'); }}
                            >
                                <Text style={styles.text}>SE CONNECTER</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
        </View>
    );
}
