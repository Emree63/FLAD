import React, { useState } from 'react';
import { Alert, View, Image, StyleSheet, Text, ImageBackground, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import normalize from '../components/Normalize';
import * as AuthSession from 'expo-auth-session';
import { register } from '../redux/thunk/authThunk';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from 'expo-av';
import { RegisterCredentials } from '../redux/actions/userActions';
import configs from '../constants/config';

// @ts-ignore
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [spotifyToken, setSpotifyToken] = useState();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  // @ts-ignore
  const failedSignup = useSelector(state => state.userReducer.failedSignup);
  // @ts-ignore
  const errorMessage = useSelector(state => state.userReducer.errorMessage);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/click.mp3')
    );
    await sound.playAsync();
  }

  const submitForm = () => {
    const isUsernameValid = /^\w+$/.test(username);
    const isEmailValid = /^\w+@\w+\.[^\s@]+$/.test(email);

    if (username.length > 30) {
      Alert.alert("Erreur inscription", "Le nom d'utilisateur ne peut pas être plus grand que 30 caractères.");
      return;
    }
    if (username == "" || username == null) {
      Alert.alert("Erreur inscription", "Le nom d'utilisateur ne peut pas être vide.");
      return;
    }
    if (!isUsernameValid) {
      Alert.alert("Erreur inscription", "Le nom d'utilisateur ne peut pas posséder de caractères spéciaux.");
      return;
    }
    if (email.length > 100) {
      Alert.alert("Erreur inscription", "L'adresse e-mail ne peut pas être plus grand que 100 caractères.");
      return;
    }
    if (!isEmailValid) {
      Alert.alert("Erreur inscription", "L'adresse e-mail n\'est pas valide.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erreur inscription", "Le mot de passe doit avoir au moins 6 caractères");
      return;
    }

    if (spotifyToken == null || spotifyToken == "") {
      Alert.alert("Erreur inscription", "Pour vous inscrire, veuillez vous connecter à Spotify.");
      return;
    }

    const credentials: RegisterCredentials = {
      email: email,
      password: password,
      tokenSpotify: spotifyToken,
      name: username
    };

    //@ts-ignore
    dispatch(register(credentials))
    playSound()
  }

  const getSpotifyToken = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri();
      const result: any = await AuthSession.startAsync({
        authUrl: configs.API_URL + '/spotify/exchange?' + 'redirectUrl=' +
          encodeURIComponent(redirectUri)
      })
      const {
        refresh_token: refresh_token,
      } = result.params
      setSpotifyToken(refresh_token)
    } catch (error) {
      Alert.alert("Erreur inscription", "La connexion à Spotify à échouer.");
      return;
    }
  }


  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <ImageBackground source={require("../assets/images/background.png")} resizeMode="cover" style={styles.image}>
          <Text style={styles.versionText}>
            v2.0
          </Text>
          <Image source={require("../assets/images/flad_logo.png")} style={styles.imageLogo} />
          <Text style={styles.text}>S'INSCRIRE</Text>
          {failedSignup && (
            <Text style={styles.textError}>{errorMessage}</Text>
          )}
          <View style={{ marginTop: 7 }}>
            <TextInput style={[styles.input, styles.shadow]} placeholder="Username"
              placeholderTextColor="#B8B4B8"
              value={username}
              onChangeText={setUsername} />
            <Image source={require('../assets/images/user_icon.png')} style={styles.iconUser} />
          </View>
          <View>
            <TextInput style={[styles.input, styles.shadow]} placeholder="Email"
              placeholderTextColor="#B8B4B8"
              value={email}
              onChangeText={setEmail} />
            <Image source={require('../assets/images/lock_icon.png')} style={styles.iconLock} />
          </View>
          <View>
            <TextInput style={[styles.input, styles.shadow]} placeholder="Password"
              placeholderTextColor="#B8B4B8"
              value={password} secureTextEntry={true}
              onChangeText={setPassword} />
            <Image source={require('../assets/images/lock_icon.png')} style={styles.iconLock} />
          </View>
          <TouchableOpacity onPress={async () => {
            await getSpotifyToken();
          }} style={[styles.buttonSpotify, styles.shadow]}>
            <Text style={styles.textIntoButton}>Lier compte</Text>
            {spotifyToken == null ? (
              <Image source={require("../assets/images/spotify_icon.png")} style={{ width: normalize(35), height: normalize(35) }} />
            ) :
              <Image source={require("../assets/images/ok_icon.png")} style={{ width: normalize(17), height: normalize(14) }} />
            }
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.shadow]} onPress={() => submitForm()}>
            <Image source={require("../assets/images/arrow_forward.png")} style={styles.buttonImage} />
          </TouchableOpacity>
          <View style={styles.connectionText}>
            <Text style={{ fontSize: normalize(18), color: 'white' }}>Tu as déjà un compte? </Text>
            <TouchableOpacity
              // @ts-ignore
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={{ fontSize: normalize(18), color: '#406DE1', textDecorationLine: 'underline' }}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </DismissKeyboard>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  imageLogo: {
    width: normalize(324),
    height: normalize(162),
    alignSelf: 'center',
    marginBottom: normalize(58),
    marginTop: -20
  },
  button: {
    marginTop: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    width: normalize(100),
    height: normalize(100),
    borderRadius: 21
  },
  textError: {
    fontSize: 15,
    alignSelf: "center",
    color: "red",
    fontWeight: 'bold'
  },
  buttonImage: {
    width: normalize(46),
    height: normalize(46),
  },
  versionText: {
    position: 'absolute',
    top: 40,
    right: 20,
    color: 'gray',
    fontWeight: 'bold',
    fontSize: normalize(17)
  },
  text: {
    fontWeight: 'bold',
    fontSize: normalize(29),
    alignSelf: 'center',
    color: 'white',
    marginBottom: 8
  },
  textIntoButton: {
    fontWeight: 'bold',
    fontSize: normalize(17),
    color: 'white',
    marginRight: 10
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.50,
    shadowRadius: 3.84,
  },
  input: {
    width: normalize(350),
    height: normalize(50),
    borderRadius: 30,
    color: 'black',
    backgroundColor: 'white',
    alignSelf: 'center',
    marginBottom: 20,
    paddingLeft: 50,
    paddingRight: 20
  },
  iconUser: {
    position: 'absolute',
    width: 20,
    height: 20,
    left: normalize(80),
    bottom: '50%'
  },
  iconLock: {
    position: 'absolute',
    width: 20,
    height: 20,
    left: normalize(80),
    bottom: '50%'
  },
  connectionText: {
    flexDirection: 'row',
    alignSelf: 'center',
    bottom: normalize(-98)
  },
  buttonSpotify: {
    width: normalize(350),
    height: normalize(50),
    backgroundColor: '#24CF5F',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    flexDirection: 'row'
  }
})
