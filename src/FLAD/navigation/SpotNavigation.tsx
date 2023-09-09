import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SpotScreen from '../screens/SpotScreen'
import DetailScreen from '../screens/DetailScreen';


export default function SpotNavigation() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{
      gestureEnabled: false,
      headerShown: false,
      cardOverlayEnabled: true,

    }}
    >
      <Stack.Screen
        name="Spot"
        component={SpotScreen}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
      />
    </Stack.Navigator>
  )
}