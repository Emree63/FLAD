import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";

export default function ChatScreen() {

    const navigation = useNavigation();

    useEffect(() => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            display: "none"
          }
        });
        return () => navigation.getParent()?.setOptions({
          tabBarStyle: undefined
        });
      }, [navigation]);
    return (
        <GiftedChat />
    )
}