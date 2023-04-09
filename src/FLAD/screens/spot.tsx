import { View, Text, Dimensions, StyleSheet, ImageBackground, Image, Pressable, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useCallback,useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import Card from '../components/Card';
import { cards as cardArray, spotArray2 } from '../data/data'
import AdjustSize from '../components/AdjustSize';
import normalize from '../components/Normalize';
import LottieView from 'lottie-react-native'
import Lotties from '../assets/lottie/Lottie';
import FladLoading from '../components/FladLoadingScreen';
import { useNavigation } from '@react-navigation/native';
import Music from '../Model/Music';
import { addFavoritesMusic } from '../redux/actions/appActions';
import { useDispatch, useSelector } from 'react-redux';
import { Spot } from '../Model/Spot';
import { removeFromSpotList, setSpotList } from '../redux/actions/spotActions';

export default function SpotPage() {
  //@ts-ignore
  const spotReducer = useSelector(state => state.appReducer.spot)
  const [cards, setCards] = useState<Spot[]>(spotReducer);
  
  const [currentCard, setcurrentCard] = useState(cards[cards.length - 1]);
  useEffect(() => {
    setCards(spotReducer);
    setcurrentCard(spotReducer[spotReducer.length - 1]);
  }, [spotReducer]);

  const onSwipe = (direction: 'left' | 'right' | 'down') => {

    if (direction === 'right') {
      // Swiped right
      addLike(currentCard);
    } else if (direction === 'left') {
      // Swiped left
      console.log('Swiped left');
      removeSpots(currentCard);
    }
    else if (direction === 'down') {
      // Swiped down
      addMockSpots();
      console.log('Swiped down');
    }
  };

  const likeButtonref = useRef<LottieView>(null);
  const onLike = useCallback(() => {
    likeButtonref.current?.reset();
    likeButtonref.current?.play(0, 55);
    likeButtonref.current?.play(55, 0);
  }, [])
  
  const dispatch = useDispatch();
  
  function addLike(spot: Spot) {
    onLike();
    dispatch(addFavoritesMusic(spot.music))
    dispatch(removeFromSpotList(spot));
  }
  function removeSpots(spot: Spot) {
    dispatch(removeFromSpotList(spot));
  }

  function addMockSpots() {
    //@ts-ignore
    dispatch(setSpotList(spotArray2))
  }

  

  const navigator = useNavigation();

  const { width: wWidht } = Dimensions.get("window");
  const hapti = (card: Spot) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    // @ts-ignore
    navigator.navigate("DetailsSpot", { "music": card.music })
  };
  return (

    <View style={{
      flex: 1,
    }}>
      {cards.length > 0 ? (
        <>
          <ImageBackground blurRadius={7}
            style={{
              position: 'absolute',
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            source={{
              uri: currentCard.music.image,
            }}
          ></ImageBackground>
          <SafeAreaView style={styles.mainSafeArea}>
            <LinearGradient colors={['rgba(2, 2, 2, 0.58) 0%', 'rgba(0, 0, 0, 0) 100.56%']} style={styles.gradient}>
              <Text
                style={{
                  fontStyle: 'normal',
                  left: wWidht / 9,
                  top: normalize(87),
                  color: "#FFFFFF",
                  fontSize: normalize(AdjustSize(currentCard.music.title)),
                  fontWeight: "800",
                }}>{currentCard.music.title}</Text>
              <Text
                style={{
                  fontStyle: 'normal',
                  left: wWidht / 9,
                  top: normalize(87),
                  color: "#FFFFFF",
                  fontSize: normalize(20),
                }}>{currentCard.music.bio}</Text>
            </LinearGradient>
          </SafeAreaView>
          <View style={{ flex: 8.35 }}>

            <View style={{ flex: 1.83, justifyContent: 'center', alignItems: 'center' }}>

              {cards.map((card) => (
                <View key={card.userSpotifyId} style={{ position: 'absolute' }} >
                  <Pressable onLongPress={() => { hapti(card) }} >
                    <Card
                      title={card.music.title}
                      image={card.music.image}
                      onSwipe={(direction) => { onSwipe(direction) }}
                    />
                  </Pressable>
                </View>
              ))
              }
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: "flex-start", justifyContent: 'center' }}>
              <Animated.View style={{ flexDirection: 'row', width: '92%', alignItems: "center", justifyContent: 'space-evenly' }}>
                <TouchableOpacity style={styles.button} onPress={() => onSwipe('left')}>
                  <Image source={require("../assets/icons/icons/icon_dislike_no_text.png")} style={{width: '45%', height: '40%'}}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => onSwipe('down')}>
                  <Image source={require("../assets/icons/icons/icon_discovery_no_text.png")} style={{width: '58%', height: '50%', marginLeft: '7%'}}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => onSwipe('right')}>
                  <LottieView autoPlay={false} loop={false} ref={likeButtonref} speed={2} source={Lotties.likeAnimation} style={styles.lottie} />
                </TouchableOpacity>

              </Animated.View>
            </View>

          </View>
        </>
      )
        : (<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: "#141414" }}>
          <View style={{ position: "absolute" }}>
            <FladLoading />
          </View>
          <Text style={{ color: "grey", fontWeight: "400", textAlign: "center", top: 100 }}>Vous avez explorer toutes les spot autour de vous.
            {"\n"}Continuer dans discoverie pour découvrir de nouvelles music basées dur vos gouts musicaux.</Text>
        </View>)
      }
    </View>

  );
};
const styles = StyleSheet.create({
  mainSafeArea: {
    flex: 1,
  },
  spot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#000'
  },
  lottie: {
    width: '100%',
  },
  button: {
    setOpacityTo: 0.8,
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    width: 61,
    height: 61,

    backgroundColor: '#24243A',
    opacity: 0.8,
    shadowRadius: 2,

  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 209,
  },
})

