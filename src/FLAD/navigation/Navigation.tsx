import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
import { GraphicalCharterDark } from '../assets/GraphicalCharterDark';
import { GraphicalCharterLight } from '../assets/GraphicalCharterLight';
import { getCurrentUserMusic, getSpotList } from '../redux/thunk/spotThunk';
import SpotifyService from '../services/spotify/spotify.service';
import * as SecureStore from 'expo-secure-store';
import { MY_SECURE_AUTH_STATE_KEY } from '../screens/Register';
import * as Location from 'expo-location';
import axios from 'axios';
import qs from 'qs';

export default function Navigation() {
  const [setErrorMsg] = useState('');
  const [location, setLocation] = useState<Location.LocationObject>();
//@ts-ignore
const tokenSend: string = useSelector(state => state.userReducer.userFladToken);
 //@ts-ignore
 const currentMusic: Music = useSelector(state => state.appReducer.userCurrentMusic);

 const dispatch = useDispatch();

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    } else {
      console.log('Permission to access location was granted');
    }
  }

  useEffect(() => {
    requestLocationPermission();
    const sendLocationUpdate = async () => {
      try {

        let tmpKey: string = await SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY) ;
        //@ts-ignore
        dispatch(getCurrentUserMusic(new SpotifyService(tmpKey)))
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status == 'granted') {
          // should app is ready 
            const locationresp = await Location.getCurrentPositionAsync({});
            // send location to server
            if(currentMusic){
              const body: Record<string, string | boolean | number | (string | boolean | number)[]> = {
                longitude: locationresp.coords.longitude,
                latitude: locationresp.coords.latitude,
                currentMusic: currentMusic.id
              }
              const resp = await axios({
                url: 'https://flad-api-production.up.railway.app/api/users/nextTo?' + qs.stringify(body),
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${tokenSend}`,
                },
              });
              const datat: Record<string, string> = resp.data.listUser2;   
              //@ts-ignore           
              dispatch(getSpotList(datat, new SpotifyService(tmpKey)))
            }
            else{
              return;
            }
            
          
        }
        else {
          //@ts-ignore
          let {status} = Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          return;
          
        }
      } catch (error) {
        console.log(error);
      }
    };
    const interval = setInterval(sendLocationUpdate, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [currentMusic]);

  // @ts-ignore
  const isDark = useSelector(state => state.userReducer.dark);
  const style = isDark ? GraphicalCharterDark : GraphicalCharterLight;
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
  //@ts-ignore
  const favoritesMusicLength: number = useSelector(state => state.appReducer.favoriteMusic.length);
  return (
    // @ts-ignore
    <NavigationContainer theme={MyTheme}>
      <BottomTabNavigator.Navigator
        initialRouteName="Spots"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          ...(Platform.OS === 'android'
            ? { tabBarLabelStyle: { bottom: normalize(10) } }
            : { tabBarLabelStyle: { bottom: normalize(-22) } }
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
    top: 5,
  }
})
