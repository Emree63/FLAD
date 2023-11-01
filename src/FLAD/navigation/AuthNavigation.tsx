import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { getRefreshToken } from '../redux/thunk/authThunk';
import { darkMode } from '../redux/thunk/userThunk';
import HomeNavigation from './HomeNavigation';
import StartNavigation from './StartNavigation';

export default function AuthNavigation() {
  //@ts-ignore
  const tokenProcessed: boolean = useSelector(state => state.userReducer.loading);
  //@ts-ignore
  const isLogin: boolean = useSelector(state => state.userReducer.isLogedIn);
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useDispatch();

  async function prepare() {
    //@ts-ignore
    await dispatch(getRefreshToken())
  }

  async function check() {
    if (tokenProcessed && appIsReady) {
      await SplashScreen.hideAsync();
    }
  }

  async function initDarkMode() {
    const currentValue: string | null = await AsyncStorage.getItem('dark');
    if (currentValue) {
      const newValue = JSON.stringify(JSON.parse(currentValue));
      //@ts-ignore
      dispatch(darkMode(JSON.parse(newValue)))
    }
  }

  useEffect(() => {
    check();
  }, [appIsReady, tokenProcessed]);

  useEffect(() => {
    prepare();
    initDarkMode();
  }, []);

  return (

    <SafeAreaProvider onLayout={() => setAppIsReady(true)}>
      {isLogin ? (
        <HomeNavigation />
      ) :
        <StartNavigation />
      }
    </SafeAreaProvider>
  )
}
