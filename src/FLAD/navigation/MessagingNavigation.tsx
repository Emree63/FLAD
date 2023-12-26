import React from 'react';
import ConversationScreen from '../screens/ConversationScreen'
import { Image, View, Text, StyleSheet } from 'react-native';
import ChatScreen from '../screens/ChatScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { LightTheme, DarkTheme, Theme } from "../constants/colors";
import { useSelector } from 'react-redux';

export default function MessagingNavigation() {
  // @ts-ignore
  const isDark = useSelector(state => state.userReducer.dark);
  const style: Theme = isDark ? DarkTheme : LightTheme;
  const MessagingStack = createStackNavigator();

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerImage: {
      width: 30,
      height: 30,
      borderRadius: 20,
      marginRight: 8
    },
    headerText: {
      color: style.Text,
      fontSize: 16,
      fontWeight: 'bold'
    }
  });

  return (
    <MessagingStack.Navigator initialRouteName="Conversation">
      <MessagingStack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ headerShown: false }}
      />
      <MessagingStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: style.Card
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                // @ts-ignore
                source={{ uri: route.params.image }}
                style={styles.headerImage}
              />
              <Text style={styles.headerText}>
                {/* @ts-ignore */}
                {route.params.username}
              </Text>
            </View>
          ),
          headerTitleStyle: {
            color: style.Text
          },
        })}
      />
    </MessagingStack.Navigator>
  )
}