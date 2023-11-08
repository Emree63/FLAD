import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import CardMusic from '../components/CardMusicComponent';
import normalize from '../components/Normalize';
import { Svg, Path } from 'react-native-svg';
import FladyComponent from '../components/FladyComponent';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import { useDispatch } from 'react-redux';
import { getFavoriteMusic } from '../redux/thunk/appThunk';
import { Spot } from '../models/Spot';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Artist from '../models/Artist';

export default function FavoriteScreen() {

    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);
    const style = isDark ? colorsDark : colorsLight;

    const images = [
        { id: 1, source: require('../assets/images/flady_love.png') },
        { id: 2, source: require('../assets/images/flady_star.png') },
        { id: 3, source: require('../assets/images/flady_angry.png') },
        { id: 4, source: require('../assets/images/flady_cry.png') },
    ];
    const navigation = useNavigation();
    //@ts-ignore
    const favoriteMusic = useSelector(state => state.appReducer.favoriteMusic);

    const dispatch = useDispatch();

    useEffect(() => {
        //@ts-ignore
        dispatch(getFavoriteMusic())
    }, []);


    const styles = StyleSheet.create({
        mainSafeArea: {
            flex: 1,
            backgroundColor: style.body,
        },
        titleContainer: {
            marginVertical: 10,
            marginLeft: 20,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 20
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
            marginBottom: 5
        }
    });

    return (
        <SafeAreaView style={styles.mainSafeArea}>
            <View style={styles.titleContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Favoris</Text>
                    <Svg width="37" height="32" viewBox="0 0 37 32">
                        <Path d="M9.39205 6.37931L14.599 18.0303C12.9892 17.8669 11.2806 18.2871 9.86635 19.6221C8.33267 21.0923 7.65381 23.3411 8.17936 25.3951C9.22118 29.409 13.8077 31.1848 17.2659 28.9363C19.748 27.3202 20.5459 24.0209 19.334 21.3091L13.3354 7.88669L16.0608 6.66869C17.5597 5.9988 18.238 4.22429 17.5681 2.72534C16.8983 1.22639 15.1237 0.548067 13.6248 1.21796L10.8994 2.43595C9.40048 3.10585 8.72216 4.88036 9.39205 6.37931Z" fill={style.Text} />
                        <Path fill-rule="evenodd" clip-rule="evenodd" d="M22.6902 6.94631C24.9408 6.17968 27.2985 7.50221 27.8347 9.85848L27.9409 10.3251C27.9935 10.5559 28.1538 10.7473 28.3718 10.8396C28.5898 10.9319 28.8388 10.9137 29.0411 10.7907L29.45 10.5421C31.5149 9.28682 34.1056 10.0587 35.122 12.2081C36.1586 14.4001 35.1314 17.1073 32.8907 18.0685L23.6308 22.041L20.0364 12.6279C19.1666 10.3502 20.3949 7.72815 22.6902 6.94631ZM18.661 13.1531L22.2742 22.6155C22.5641 23.3744 23.4162 23.735 24.1628 23.4148L33.4711 19.4215C36.4742 18.1332 37.8481 14.5289 36.453 11.5787C35.1306 8.78232 31.8557 7.69783 29.1345 9.03746C28.2019 6.15137 25.1435 4.55531 22.2155 5.5527C19.1263 6.60497 17.4953 10.1004 18.661 13.1531Z" fill={style.Text} />
                    </Svg>
                </View>
                <Text style={styles.description}>Retrouvez ici vos musiques favorites</Text>
            </View>
            <FlatList
                data={favoriteMusic}
                keyExtractor={(item: Spot) => item.music.id}
                renderItem={({ item }) => (
                    //@ts-ignore
                    <TouchableOpacity onPress={() => { navigation.navigate("Detail", { "music": item.music }) }}>
                        <CardMusic image={item.music.cover} title={item.music.name} description={item.music.artists.map((artist: Artist) => artist.name).join(', ')} id={item.music.id} />
                    </TouchableOpacity>
                )}
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