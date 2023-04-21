// import { Alert } from 'react-native';
// import initialize from '../../lib';
// import * as Paho from '../../lib/paho-mqtt';

// initialize();

// class MqttClient {
//   client: any;
//   callbacks: { [key: string]: (payloadString: string) => void };
//   onSuccessHandler?: () => void;
//   onConnectionLostHandler?: () => void;
//   isConnected: boolean;

//   constructor() {
//     const clientId = 'ReactNativeMqtt';

//     this.client = new Paho.Client('127.0.0.1', 9001, clientId);
//     this.client.onMessageArrived = this.onMessageArrived.bind(this);
//     this.callbacks = {};
//     this.onSuccessHandler = undefined;
//     this.onConnectionLostHandler = undefined;
//     this.isConnected = false;
//   }

//   onConnect = (
//     onSuccessHandler: () => void,
//     onConnectionLostHandler: () => void,
//   ) => {
//     this.onSuccessHandler = onSuccessHandler;
//     this.onConnectionLostHandler = onConnectionLostHandler;
//     this.client.onConnectionLost = () => {
//       this.isConnected = false;
//       onConnectionLostHandler();
//     };

//     this.client.connect({
//       timeout: 10,
//       onSuccess: () => {
//         this.isConnected = true;
//         onSuccessHandler();
//       },
//       useSSL: false,
//       onFailure: this.onError.bind(this),
//       reconnect: true,
//       keepAliveInterval: 20,
//       cleanSession: true,
//     });
//   };

//   onError = ({ errorMessage }: { errorMessage: string }) => {
//     console.log(errorMessage);
//     this.isConnected = false;
//     Alert.alert('Failed', 'Failed to connect to MQTT', [
//       {
//         text: 'Cancel',
//         onPress: () => console.log('Cancel Pressed'),
//         style: 'cancel',
//       },
//       {
//         text: 'Try Again',
//         onPress: () =>
//           this.onConnect(
//             this.onSuccessHandler!,
//             this.onConnectionLostHandler!,
//           ),
//       },
//     ]);
//   };

//   onMessageArrived = (message: Paho.Message) => {
//     const { payloadString, topic } = message;
//     console.log('onMessageArrived:', payloadString);
//     this.callbacks[topic](payloadString);
//   };

//   onPublish = (topic: string, message: string) => {
//     this.client.publish(topic, message);
//   };

//   onSubscribe = (topic: string, callback: (payloadString: string) => void) => {
//     this.callbacks[topic] = callback;
//     this.client.subscribe(topic);
//   };

//   unsubscribe = (topic: string) => {
//     delete this.callbacks[topic];
//     this.client.unsubscribe(topic);
//   };
// }

// let client = new MqttClient();
// export { client as MqttClient };
