import React from 'react';
import SpotScreen from '../screens/SpotScreen'
import DetailScreen from '../screens/DetailScreen';
import { createStackNavigator } from '@react-navigation/stack';

export default function SpotNavigation() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Spot"
        component={SpotScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}