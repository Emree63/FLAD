import React from 'react';
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity, TouchableHighlight, SafeAreaView } from 'react-native';
import CardMusic from '../components/CardMusic';
import normalize from '../components/Normalize';
import Music from '../model/Music'
import FladyComponent from '../components/FladyComponent';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { SharedElement } from 'react-navigation-shared-element';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';

export default function FavoriteScreen() {

    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);
    const style = isDark ? colorsDark : colorsLight;

    const navigation = useNavigation();
    //@ts-ignore
    const favoritesMusic = useSelector(state => state.appReducer.favoriteMusic);
    const images = [
        { id: 1, source: require('../assets/images/flady_love.png') },
        { id: 2, source: require('../assets/images/flady_star.png') },
        { id: 3, source: require('../assets/images/flady_angry.png') },
        { id: 4, source: require('../assets/images/flady_cry.png') },
    ];
    const navigueToDetail = (music: any) => {
        // @ts-ignore
        navigation.navigate("MusicDetail", { "music": music })
    };
    const styles = StyleSheet.create({
        mainSafeArea: {
            flex: 1,
            backgroundColor: style.body,
        },
        titleContainer: {
            marginTop: 30,
            marginLeft: 20,
        },
        title: {
            fontSize: normalize(28),
            fontWeight: 'bold',
            color: style.Text,
        },
        description: {
            marginTop: 10,
            fontSize: normalize(20),
            color: '#787878',
            marginBottom: 20
        },
        button: {
            marginTop: '10%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: 'white',
            width: normalize(100),
            height: normalize(100),
            borderRadius: 21
        },
        buttonImage: {
            width: normalize(46),
            height: normalize(46),
        },
        shadow: {
            shadowColor: '#000',
            shadowOffset: {
                width: 2,
                height: 3,
            },
            shadowOpacity: 0.50,
            shadowRadius: 3.84,
        }
    });

    return (
        <SafeAreaView style={styles.mainSafeArea}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Favoris</Text>
                <Text style={styles.description}>Retrouvez ici vos musiques favorites</Text>
            </View>
            <FlatList
                data={favoritesMusic}
                renderItem={({ item }) => (
                    <TouchableHighlight onPress={() => { navigueToDetail(item) }}>
                        <SharedElement id={item.id}>
                            <CardMusic image={item.image} title={item.title} description={item.bio} id={item.id} />
                        </SharedElement>
                    </TouchableHighlight>
                )}
                keyExtractor={(item: Music) => item.title}
                ListFooterComponent={
                    <>
                        <Text style={[styles.title, { marginLeft: 20 }]}>What's your mood?</Text>
                        <FlatList
                            style={{ marginTop: 10 }}
                            data={images}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <FladyComponent image={item.source} />
                            )}
                        />
                    </>
                }
                nestedScrollEnabled={true}
            />
        </SafeAreaView>
    );
};