import { View, Text, Dimensions, StyleSheet, ImageBackground, Image, Pressable, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Card from '../components/CardComponent';
import normalize from '../components/Normalize';
import Loading from '../components/LoadingComponent';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Spot } from '../models/Spot';
import { removeFromSpotList } from '../redux/actions/spotActions';
import { MusicServiceProvider } from '../models/MusicServiceProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Artist from '../models/Artist';

export default function SpotScreen() {
  //@ts-ignore
  const spotReducer: Spot[] = useSelector(state => state.appReducer.spot)

  const [cards, setCards] = useState<Spot[]>(spotReducer);
  const [currentCard, setcurrentCard] = useState<Spot>(cards[cards.length - 1]);

  const dispatch = useDispatch();

  useEffect(() => {
    setCards(spotReducer);
    setcurrentCard(spotReducer[spotReducer.length - 1]);
  }, [spotReducer]);

  const onSwipe = (direction: 'left' | 'right' | 'down') => {
    if (direction === 'right') {
      dispatch(removeFromSpotList(currentCard));
    } else if (direction === 'left') {
      dispatch(removeFromSpotList(currentCard));
    }
    else if (direction === 'down') {
      MusicServiceProvider.musicService.addToPlaylist(currentCard.music.id);
      dispatch(removeFromSpotList(currentCard));
    }
  };

  const navigator = useNavigation();

  const { width: width } = Dimensions.get("window");
  const hapti = (card: Spot) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    // @ts-ignore
    navigator.navigate("Detail", { "music": card.music })
  };

  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    background1: {
      backgroundColor: 'black',
      height: '100%',
      width: '100%',
      paddingTop: insets.top,
    },
    background2: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: "#141414",
      paddingTop: insets.top
    },
    posterBackground: {
      width: "130%",
      height: "130%",
      justifyContent: "center",
      alignItems: "center",
      position: 'absolute',
      left: "-40%",
      top: "-20%"
    },
    gradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: insets.top + 150,
    },
    titleLabel: {
      fontStyle: 'normal',
      left: width / 9,
      top: '5%',
      color: "#FFFFFF",
      fontSize: normalize(40),
      fontWeight: "800",
    },
    artistLabel: {
      fontStyle: 'normal',
      left: width / 9,
      top: '5%',
      color: "#FFFFFF",
      fontSize: normalize(20),
    },
    buttonSection: {
      flexDirection: 'row',
      justifyContent: "space-evenly",
      paddingHorizontal: 30,
      width: '100%',
      position: "absolute",
      top: "74%"
    },
    button: {
      alignItems: 'center',
      borderRadius: 100,
      justifyContent: 'center',
      width: 61,
      height: 61,
      backgroundColor: '#24243A',
      opacity: 0.8
    },
    dislikeIcon: {
      resizeMode: "stretch",
      height: '44%',
      aspectRatio: 1.05,
    },
    discoveryIcon: {
      resizeMode: "stretch",
      height: '50%',
      aspectRatio: 1.5,
      marginLeft: '7%'
    },
    likeIcon: {
      resizeMode: "stretch",
      height: '50%',
      aspectRatio: 1.1
    },
    loading: {
      position: 'absolute',
      paddingBottom: 50
    },
    explanation: {
      color: "grey",
      fontSize: 13,
      fontWeight: "400",
      textAlign: "center",
      marginTop: 150
    }
  });

  return (
    <>
      {cards.length > 0 ? (
        <SafeAreaView style={styles.background1}>
          <ImageBackground blurRadius={5}
            style={styles.posterBackground}
            source={{
              uri: currentCard.music.cover,
            }}
          />
          <LinearGradient colors={['rgba(2, 2, 2, 0.40) 0%', 'rgba(0, 0, 0, 0) 100%']} style={styles.gradient} />
          <Text style={styles.titleLabel}>{currentCard.music.name}</Text>
          <Text style={styles.artistLabel}>{currentCard.music.artists.map((artist: Artist) => artist.name).join(', ')}</Text>
          <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
            {cards.map((card, index) => (
              <View
                key={index}
                style={{
                  position: 'absolute',
                }}
              >
                <Pressable onLongPress={() => hapti(card)}>
                  <Card
                    image={card.music.cover}
                    onSwipe={(direction) => onSwipe(direction)}
                  />
                </Pressable>
              </View>
            ))}
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.button} onPress={() => onSwipe('left')}>
              <Image source={require("../assets/images/dislike_icon_no_text.png")} style={styles.dislikeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onSwipe('down')}>
              <Image source={require("../assets/images/discovery_icon_no_text.png")} style={styles.discoveryIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onSwipe('right')}>
              <Image source={require("../assets/images/like_icon_no_text.png")} style={styles.likeIcon} />
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      )
        : (<SafeAreaView style={styles.background2}>
          <View style={styles.loading}>
            <Loading />
          </View>
          <Text style={styles.explanation}>Vous avez explorer toutes les spot autour de vous.
            {"\n"}Continuer dans discoverie pour découvrir de nouvelles music basées sur vos gouts musicaux.</Text>
        </SafeAreaView>)
      }
    </>

  );
};
