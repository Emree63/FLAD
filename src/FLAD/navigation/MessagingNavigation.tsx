import React from 'react';
import ConversationScreen from '../screens/ConversationScreen'
import ChatScreen from '../screens/ChatScreen';
import { createStackNavigator } from '@react-navigation/stack';

export default function MessagingNavigation() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Conversation" >
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}