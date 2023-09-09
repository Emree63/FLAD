import React from 'react';
import Favorite from '../screens/FavoriteScreen';
import DetailScreen from '../screens/DetailScreen';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();
export default function MusicNavigation() {
  return (
    <Stack.Navigator initialRouteName="Favorite" screenOptions={{ gestureEnabled: true, headerShown: false, cardOverlayEnabled: true, cardStyle: { backgroundColor: "transparent" } }} >
      <Stack.Screen
        name="Favorite"
        component={Favorite}

      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        sharedElements={(route) => { return [route.params.music.id] }}
      />
    </Stack.Navigator>
  )
}