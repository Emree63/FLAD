import React from 'react';
import SpotScreen from '../screens/SpotScreen'
import DetailScreen from '../screens/DetailScreen';
import { createStackNavigator } from '@react-navigation/stack';

export default function SpotNavigation() {
  const SpotStack = createStackNavigator();
  return (
    <SpotStack.Navigator>
      <SpotStack.Screen
        name="Spot"
        component={SpotScreen}
        options={{ headerShown: false }}
      />
      <SpotStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
    </SpotStack.Navigator>
  )
}