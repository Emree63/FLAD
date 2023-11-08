import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FavoriteNavigation from './FavoriteNavigation';
import SettingNavigation from './SettingNavigation';
import normalize from '../components/Normalize';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SpotNavigation from './SpotNavigation';
import MessagingNavigation from './MessagingNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import { getUserCurrentMusic } from '../redux/thunk/appThunk';
import { logout } from '../redux/thunk/authThunk';
import { setAccessError, setErrorEmptyMusic } from '../redux/actions/userActions';


export default function HomeNavigation() {
  //@ts-ignore
  const favoritesMusicLength = useSelector(state => state.appReducer.nbAddedFavoritesMusic);
  //@ts-ignore
  const accessError = useSelector(state => state.userReducer.accessError);
  //@ts-ignore
  const errorEmptyMusic = useSelector(state => state.userReducer.errorEmptyMusic);
  // @ts-ignore
  const isDark = useSelector(state => state.userReducer.dark);
  const style = isDark ? colorsDark : colorsLight;
  const BottomTabNavigator = createBottomTabNavigator();
  const MyTheme = {
    dark: false,
    colors: {
      primary: 'rgb(255, 45, 85)',
      card: style.Card,
      border: style.Card,
      text: 'rgb(138, 138, 138)',
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    //@ts-ignore
    dispatch(getUserCurrentMusic());
  }, []);

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
    <NavigationContainer theme={MyTheme}>
      <BottomTabNavigator.Navigator
        initialRouteName="Spots"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          ...(Platform.OS === 'android'
            ? { tabBarLabelStyle: { bottom: normalize(10) } }
            : { tabBarLabelStyle: { bottom: normalize(-25) } }
          ),

        }}>
        <BottomTabNavigator.Screen name="Spots" component={SpotNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <View style={styles.IconContainer}><TabBarIcon name="music" color={color} /></View>,
          }} />
        <BottomTabNavigator.Screen name="Favorites" component={FavoriteNavigation}
          options={{
            tabBarBadge: favoritesMusicLength,
            tabBarBadgeStyle: { backgroundColor: 'yellow' },
            headerShown: false,
            tabBarIcon: ({ color }) => <View style={styles.IconContainer}><TabBarIcon name="heart" color={color} /></View>,
          }} />
        <BottomTabNavigator.Screen name="Messages" component={MessagingNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <View style={styles.IconContainer}><TabBarIcon name="comment" color={color} /></View>,
          }} />
        <BottomTabNavigator.Screen name="Settings" component={SettingNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <View style={styles.IconContainer}><TabBarIcon name="cog" color={color} /></View>,
          }} />
      </BottomTabNavigator.Navigator>
    </NavigationContainer>
  )
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} {...props} />;
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    position: 'absolute',
    bottom: normalize(50),
    borderRadius: 30,
    marginHorizontal: 25
  },
  IconContainer: {
    position: 'absolute',
    top: 6,
  }
})
