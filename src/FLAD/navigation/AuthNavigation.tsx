import HomeNavigation from './HomeNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StartNavigation from './StartNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { ChangeMode, getRefreshToken } from '../redux/thunk/authThunk';

export default function AuthNavigation() {
  //@ts-ignore
  const tokenProcesed: boolean = useSelector(state => state.userReducer.loading);
  //@ts-ignore
  const isLogin: boolean = useSelector(state => state.userReducer.isLogedIn);
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useDispatch();
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
      console.log("An error occurred while updating the boolean value for the 'dark' key: ", error);
    }
  }
  useEffect(() => {
    ChangeDarkMode();
    prepare();

  }, [appIsReady, tokenProcesed]);


  if (tokenProcesed == false) {
    return null;
  }

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
