import React from 'react';
import Favorite from '../screens/Favorite';
import MusicDetail from '../screens/MusicDetail';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import CurrentMusic from '../components/CurrentMusic';

const Stack = createSharedElementStackNavigator();
export default function MusicNavigation() {
  return (
    <Stack.Navigator initialRouteName="Favorite" screenOptions={{ gestureEnabled: true, headerShown: false, cardOverlayEnabled: true, cardStyle: { backgroundColor: "transparent" } }} >
      <Stack.Screen
        name="Favorite"
        component={Favorite}

      />
      <Stack.Screen
        name="MusicDetail"
        component={MusicDetail}
        sharedElements={(route) => { return [route.params.music.id] }}
      />
    </Stack.Navigator>
  )
}