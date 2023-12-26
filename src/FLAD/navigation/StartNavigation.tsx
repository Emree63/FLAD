import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StartScreen from '../screens/StartScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

export default function StartNavigation() {
  const StartStack = createStackNavigator();
  return (
    <NavigationContainer>
      <StartStack.Navigator>
        <StartStack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <StartStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <StartStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </StartStack.Navigator>
    </NavigationContainer>

  )
}