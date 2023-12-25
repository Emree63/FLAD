import React from 'react';
import ConversationScreen from '../screens/ConversationScreen'
import { Image, View, Text, StyleSheet } from 'react-native';
import ChatScreen from '../screens/ChatScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { colorsDark } from "../constants/colorsDark";
import { colorsLight } from "../constants/colorsLight";
import { useSelector } from 'react-redux';

export default function MessagingNavigation() {
  // @ts-ignore
  const isDark = useSelector(state => state.userReducer.dark);
  const style = isDark ? colorsDark : colorsLight;
  const Stack = createStackNavigator();

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
    <Stack.Navigator initialRouteName="Conversation">
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
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
    </Stack.Navigator>
  )
}