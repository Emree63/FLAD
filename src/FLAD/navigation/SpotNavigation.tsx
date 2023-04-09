import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SpotPage from '../screens/spot'
import MusicDetail from '../screens/MusicDetail';


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
        name="SpotsPage"
        component={SpotPage}
      />
      <Stack.Screen
        name="DetailsSpot"
        component={MusicDetail}
      />
    </Stack.Navigator>
  )
}