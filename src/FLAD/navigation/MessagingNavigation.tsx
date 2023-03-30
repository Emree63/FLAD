import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Conversation from '../screens/Conversation'

export default function SpotNavigation() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="ConversationList">
      <Stack.Screen
        name="ConversationList"
        component={Conversation}
      />

    </Stack.Navigator>
  )
}