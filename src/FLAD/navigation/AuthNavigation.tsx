import Navigation from './Navigation';
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
      console.log(`Une erreur s'est produite lors de la mise à jour de la valeur booléenne pour la clé 'dark': `, error);
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
        <Navigation />
      ) :
        <StartNavigation/>
      }
    </SafeAreaProvider>
  )
}
