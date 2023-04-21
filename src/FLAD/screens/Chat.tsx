import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { Button, TextInput, View ,StyleSheet } from "react-native";
import { MqttClient } from "../utils/MqttClient";

export default function Chat() {
  const [message, setMessage] = React.useState([]);
  const [publishPayload, setPublishPayload] = React.useState('');
  const [publishTopic, setPublishTopic] = React.useState('');
  const [subscribeTopic, setSubscribeTopic] = React.useState('');
  const [isSubscribed, setSubscribed] = React.useState(false);
  const [mqttConnected, setMqttConnected] = React.useState(false);
  const onSuccess = () => {
    console.log('Mqtt Connected');
    setMqttConnected(true);
  };
  
  const onConnectionLost = () => {
    setMqttConnected(false);
    console.log('Mqtt Fail to connect');
  };
  React.useEffect(() => {
    MqttClient.onConnect(onSuccess, onConnectionLost);
  }, []);

 


  const onSubscribe = message => {
    setMessage(message);
  };

  function onSubscribeHandler() {
    MqttClient.onSubscribe(subscribeTopic, onSubscribe);
    setSubscribed(true);
  }

  function onPublishHandler() {
    MqttClient.onPublish(publishTopic, publishPayload);
    setPublishPayload('');
  }

  function unSubscribeHandler() {
    MqttClient.unsubscribe(subscribeTopic);
    setSubscribeTopic('');
    setSubscribed(false);
  }
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
     <GiftedChat></GiftedChat>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {},
  subscribeContainer: {
    marginVertical: 50,
    marginHorizontal: 30,
    justifyContent: 'center',
  },
  inputStyle: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  inputStylePublish: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingVertical: 5,
    marginVertical: 20,
  },
  publishContainer: {
    marginVertical: 10,
    marginHorizontal: 30,
  },
  messageContainer: {
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
});