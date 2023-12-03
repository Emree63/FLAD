import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { faUser, faEnvelope, faHeart, faMusic } from "@fortawesome/free-solid-svg-icons"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import FavoriteNavigation from './FavoriteNavigation';
import SettingNavigation from './SettingNavigation';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import SpotNavigation from './SpotNavigation';
import MessagingNavigation from './MessagingNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCurrentMusic } from '../redux/thunk/appThunk';
import { logout } from '../redux/thunk/authThunk';
import { setAccessError, setErrorEmptyMusic } from '../redux/actions/userActions';
import * as Location from 'expo-location';
import { getSpotList } from '../redux/thunk/spotThunk';
import Music from '../models/Music';
import normalize from '../components/Normalize';

export default function HomeNavigation() {
  //@ts-ignore
  const favoritesMusicLength = useSelector(state => state.appReducer.nbAddedFavoriteMusic);
  //@ts-ignore
  const accessError = useSelector(state => state.userReducer.accessError);
  //@ts-ignore
  const errorEmptyMusic = useSelector(state => state.userReducer.errorEmptyMusic);
  // @ts-ignore
  const isDark = useSelector(state => state.userReducer.dark);
  // @ts-ignore
  const currentMusic: Music = useSelector(state => state.appReducer.userCurrentMusic);
  const [locationPermission, setLocationPermission] = useState(false);

  const BottomTabNavigator = createBottomTabNavigator();

  const dispatch = useDispatch();

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert(
        "Oups ! Il semble que l'accès à votre localisation soit désactivé. Pour découvrir la musique des personnes autour de vous, veuillez autoriser l'accès à la localisation dans les paramètres de votre appareil."
      );
    } else {
      setLocationPermission(true);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    const getSpots = async () => {
      //@ts-ignore
      dispatch(getUserCurrentMusic());
    }

    getSpots();

    const interval = setInterval(getSpots, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getSpots();
  }, [currentMusic]);

  const getSpots = async () => {
    if (currentMusic && locationPermission) {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
      //@ts-ignore
      dispatch(getSpotList(location.coords.longitude, location.coords.latitude, currentMusic._id));
    }
  }

  useEffect(() => {
    if (accessError) {
      Alert.alert(
        "Problème lié à votre compte",
        "Votre compte ne fait plus partie des utilisateurs ayant accès à l'application. Pour plus d'informations, veuillez contacter l'équipe de support à l'adresse suivante : fladdevpro@gmail.com.",
        [
          {
            text: 'Réessayer plus tard',
            onPress: () => {
              dispatch(setAccessError(false))
              //@ts-ignore
              dispatch(logout());
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [accessError]);

  useEffect(() => {
    if (errorEmptyMusic) {
      Alert.alert(
        "Bienvenue sur FLAD 🎵",
        "Votre compte Spotify semble tout neuf, donc pour le moment, vous ne pouvez pas encore partager de musique.\n\n" +
        "Pas encore de playlist secrète ? Aucun morceau honteux ? Nous attendons impatiemment vos découvertes musicales !",
        [
          {
            text: "D'accord",
            onPress: () => dispatch(setErrorEmptyMusic(false)),
          }
        ]
      );
    }
  }, [errorEmptyMusic]);


  return (
    // @ts-ignore
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <BottomTabNavigator.Navigator
        initialRouteName="Spots"
        screenOptions={{
          tabBarActiveTintColor: isDark ? "white" : "rgb(255, 45, 85)",
          tabBarStyle: {
            backgroundColor: isDark ? "rgb(46,46,46)" : "white",
          },
        }}>
        <BottomTabNavigator.Screen name="Spots" component={SpotNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name={faMusic} color={color} size={23} />,
          }} />
        <BottomTabNavigator.Screen name="Favorites" component={FavoriteNavigation}
          options={{
            tabBarBadge: favoritesMusicLength,
            tabBarBadgeStyle: {
              backgroundColor: 'yellow',
              maxWidth: 12.5,
              marginTop: 3,
              maxHeight: 13,
              borderRadius: 7,
              fontSize: normalize(10),
              lineHeight: 12,
            },
            headerShown: false,
            tabBarIcon: ({ color }) => <View><TabBarIcon name={faHeart} color={color} size={23} /></View>,
          }} />
        <BottomTabNavigator.Screen name="Messages" component={MessagingNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <View ><TabBarIcon name={faEnvelope} color={color} size={23} /></View>,
          }} />
        <BottomTabNavigator.Screen name="Profil" component={SettingNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => <TabBarIcon name={faUser} color={color} size={23} />,
          }} />
      </BottomTabNavigator.Navigator>
    </NavigationContainer>
  )
}

function TabBarIcon(props: {
  name: any;
  color: string;
  size: number;
}) {
  return <FontAwesomeIcon icon={props.name} style={{ marginBottom: -5 }} size={props.size} color={props.color} />;
}