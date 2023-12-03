import React from 'react';
import SettingScreen from '../screens/SettingScreen';
import ProfilScreen from '../screens/ProfilScreen';
import { createStackNavigator } from '@react-navigation/stack';

export default function SettingNavigation() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Setting">
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={ProfilScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}