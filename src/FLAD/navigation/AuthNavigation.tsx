import Navigation from './Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StartNavigation from './StartNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { ChangeMode, getRefreshToken } from '../redux/thunk/authThunk';
import * as Location from 'expo-location';
import SpotifyService from '../services/spotify/spotify.service';
import { getCurrentUserMusic, getSpotList } from '../redux/thunk/spotThunk';
import Music from '../Model/Music';
import axios from 'axios';
import qs from 'qs';
import * as SecureStore from 'expo-secure-store';
import { MY_SECURE_AUTH_STATE_KEY } from '../screens/Register';

export default function AuthNavigation() {
  //@ts-ignore
  const tokenProcesed: boolean = useSelector(state => state.userReducer.loading);
  //@ts-ignore
  const isLogin: boolean = useSelector(state => state.userReducer.isLogedIn);
  //@ts-ignore
  const currentMusic: Music = useSelector(state => state.appReducer.userCurrentMusic);
  //@ts-ignore
  const tokenSend: string = useSelector(state => state.userReducer.userFladToken);

  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useDispatch();

  const [location, setLocation] = useState<Location.LocationObject>();
  const [setErrorMsg] = useState('');

  async function prepare() {
    //@ts-ignore
    await dispatch(getRefreshToken())
    if (tokenProcesed && appIsReady) {
      await SplashScreen.hideAsync();
    }
  }

  async function ChangeDarkMode() {
    try {
      const currentValue = await AsyncStorage.getItem('dark');
      if (currentValue !== null) {
        const newValue = JSON.stringify(JSON.parse(currentValue));
        //@ts-ignore
        dispatch(ChangeMode(JSON.parse(newValue)))
      } 
    } catch (error) {
      console.log(`Une erreur s'est produite lors de la mise à jour de la valeur booléenne pour la clé 'dark': `, error);
    }
  }
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    } else {
      console.log('Permission to access location was granted');
    }
  }
  useEffect(() => {
    ChangeDarkMode();
    prepare();
    requestLocationPermission();
    const sendLocationUpdate = async () => {
      try {

        let tmpKey: string = await SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY) ;
        //@ts-ignore
        await dispatch(getCurrentUserMusic(new SpotifyService(tmpKey)))
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
    const interval = setInterval(sendLocationUpdate, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [appIsReady, tokenProcesed, currentMusic]);

  
  if (tokenProcesed == false) {
    return null;
  }

  return (
    
    <SafeAreaProvider onLayout={() => setAppIsReady(true)}>
      {isLogin ? (
        <Navigation />
      ) :
        <StartNavigation/>
      }
    </SafeAreaProvider>
  )
}
