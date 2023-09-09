import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ConversationScreen from '../screens/ConversationScreen'
import ChatScreen from '../screens/ChatScreen';

export default function MessagingNavigation() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Conversation" screenOptions={{ gestureEnabled: true, headerShown: false, cardOverlayEnabled: true, cardStyle: { backgroundColor: "transparent" } }}>
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: true
        }}
      />
    </Stack.Navigator>
  )
}