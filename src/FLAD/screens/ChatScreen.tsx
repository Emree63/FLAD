import React, { useCallback, useEffect, useState } from "react";
import { Bubble, GiftedChat, IMessage, InputToolbar, Send } from "react-native-gifted-chat";
import { faFileImage, faMicrophone } from "@fortawesome/free-solid-svg-icons"
import { LightTheme, DarkTheme, Theme } from "../constants/colors";
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Message from "../models/Message";
import { getMessages, sendMessage } from "../redux/thunk/chatThunk";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

//@ts-ignore
export default function Chat({ route }) {
  const item: string = route.params.conversation;
  const [messages, setMessages] = useState<IMessage[]>();
  //@ts-ignore
  const conversations: Message[] = useSelector(state => state.appReducer.messages);

  // @ts-ignore
  const isDark = useSelector(state => state.userReducer.dark);
  const style: Theme = isDark ? DarkTheme : LightTheme;

  const dispatch = useDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(getMessages(item));
  }, []);

  useEffect(() => {
    const mappedMessages = conversations.map((msg: Message) => ({
      _id: msg.id,
      text: msg.content,
      createdAt: msg.date,
      user: {
        _id: msg.sender,
        name: msg.sender,
        avatar: 'https://picsum.photos/536/354',
      },
      audio: msg.audio
    }));

    mappedMessages.reverse();

    mappedMessages.push({
      _id: "0",
      text: 'Vous avez matché !!!',
      system: true,
    });

    setMessages(mappedMessages);
  }, [conversations]);

  const onSend = useCallback((messages: any = []) => {

    const newMessage = new Message(
      "-1",
      messages[0].text,
      "User1",
      new Date()
    );

    // @ts-ignore
    dispatch(sendMessage(item, newMessage));
  }, [])

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: style.Card,
          }
        }}
        textStyle={{
          left: {
            paddingHorizontal: 3,
            color: style.Text,
          },
          right: {
            paddingHorizontal: 3
          }
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: style.Card,
          borderTopWidth: 0,
        }}
        primaryStyle={{
          alignItems: "center"
        }}
      />
    );
  };

  function handleImageIconPress(): void {
    console.log("Image");
  }

  function handleMicrophoneIconPress(): void {
    console.log("Audio");
  }

  const renderActions = (props: any) => {
    return (
      <View style={{ flexDirection: 'row', marginLeft: 15 }}>
        <TouchableOpacity onPress={handleImageIconPress}>
          <FontAwesomeIcon icon={faFileImage} size={20} color={style.Line} style={{ marginRight: 10 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMicrophoneIconPress}>
          <FontAwesomeIcon icon={faMicrophone} size={20} color={style.Line} />
        </TouchableOpacity>
      </View>
    );
  };


  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View>
          <Icon name="send" size={20} style={{ marginBottom: 12, marginHorizontal: 8 }} color="#2e64e5" />
        </View>
      </Send>
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome name='angle-double-down' size={22} color="#333" />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: style.Card }}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: "User1",
        }}
        listViewProps={{
          style: {
            backgroundColor: style.body
          },
        }}
        // @ts-ignore
        textInputStyle={{
          backgroundColor: style.Line,
          borderRadius: 20,
          paddingHorizontal: 15,
          paddingTop: 10,
          marginTop: 5,
          color: style.Text
        }}
        renderActions={renderActions}
        maxInputLength={255}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        placeholder="Chat"
      />
    </SafeAreaView>
  );
}