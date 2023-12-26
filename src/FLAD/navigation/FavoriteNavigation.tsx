import React from 'react';
import Favorite from '../screens/FavoriteScreen';
import DetailScreen from '../screens/DetailScreen';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const FavoriteStack = createSharedElementStackNavigator();
export default function MusicNavigation() {
  return (
    <FavoriteStack.Navigator initialRouteName="Favorite">
      <FavoriteStack.Screen
        name="Favorite"
        component={Favorite}
        options={{ headerShown: false }}
      />
      <FavoriteStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
    </FavoriteStack.Navigator>
  )
}