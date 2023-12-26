import React from 'react';
import SettingScreen from '../screens/SettingScreen';
import ProfilScreen from '../screens/ProfilScreen';
import { createStackNavigator } from '@react-navigation/stack';

export default function SettingNavigation() {
  const SettingStack = createStackNavigator();
  return (
    <SettingStack.Navigator initialRouteName="Setting">
      <SettingStack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <SettingStack.Screen
        name="Account"
        component={ProfilScreen}
        options={{ headerShown: false }}
      />
    </SettingStack.Navigator>
  )
}