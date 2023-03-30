import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Conversation from '../screens/Conversation'

export default function SpotNavigation() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Conversation" screenOptions={{ gestureEnabled: true, headerShown: false, cardOverlayEnabled: true, cardStyle: { backgroundColor: "transparent" } }}>
      <Stack.Screen
        name="Conversation"
        component={Conversation}
      />

    </Stack.Navigator>
  )
}