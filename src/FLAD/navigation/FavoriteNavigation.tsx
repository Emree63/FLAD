import React from 'react';
import Favorite from '../screens/FavoriteScreen';
import DetailScreen from '../screens/DetailScreen';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();
export default function MusicNavigation() {
  return (
    <Stack.Navigator initialRouteName="Favorite">
      <Stack.Screen
        name="Favorite"
        component={Favorite}
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