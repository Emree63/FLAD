import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Conversation from '../screens/Conversation'
import Chat from '../screens/Chat';

export default function MessagingNavigation() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Conversation" screenOptions={{ gestureEnabled: true, headerShown: false, cardOverlayEnabled: true, cardStyle: { backgroundColor: "transparent" } }}>
      <Stack.Screen
        name="Conversation"
        component={Conversation}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options = {{
          headerShown: true
        }}
      />
    </Stack.Navigator>
  )
}