import React, { useEffect, useState } from 'react';
import { Alert, View, Image, StyleSheet, Text, ImageBackground, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { setErrorNetwork } from "../redux/actions/userActions";
import { useNavigation } from "@react-navigation/native";
import normalize from '../components/Normalize';
import { login } from '../redux/thunk/authThunk';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from 'expo-av';
import { LoginCredentials } from '../redux/actions/userActions';

// @ts-ignore
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

export default function LoginScreen() {
    const [sound, setSound] = useState<Audio.Sound>();
    const [rememberMe, setRememberMe] = useState(false);
    const navigation = useNavigation();
    // @ts-ignore
    const failedLogin = useSelector(state => state.userReducer.failedLogin);
    // @ts-ignore
    const networkError = useSelector(state => state.userReducer.errorNetwork);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/click.mp3')
        );
        setSound(sound);
        await sound.playAsync();
    }
    const dispatch = useDispatch();

    const submitForm = () => {
        const credentials: LoginCredentials = {
            email: username.toLowerCase(),
            password: password.toLowerCase()
        };
        //@ts-ignore
        dispatch(login(credentials))
        playSound()
    }

    useEffect(() => {
        if (networkError) {
          Alert.alert(
            'Erreur réseau',
            'Une erreur réseau s\'est produite. Veuillez vérifier votre connexion internet et réessayer.',
            [
              {
                text: 'OK',
                onPress: () => {
                  dispatch(setErrorNetwork(false));
                },
              },
            ],
            { cancelable: false }
          );
        }
      }, [networkError, dispatch]);

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    }

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <ImageBackground source={require("../assets/images/background.png")} resizeMode="cover" style={styles.image}>
                    <Text style={styles.versionText}>
                        v2.0
                    </Text>
                    <Image source={require("../assets/images/flad_logo.png")} style={styles.imageLogo} />
                    <Text style={styles.text}>SE CONNECTER</Text>
                    {failedLogin && (
                        <Text style={styles.textError}>Email ou mot de passe incorrect!</Text>
                    )}
                    <View style={{ marginTop: 7 }}>
                        <TextInput placeholder="Email"
                            placeholderTextColor="#B8B4B8"
                            value={username}
                            onChangeText={setUsername} style={[styles.input, styles.shadow]} />
                        <Image source={require('../assets/images/user_icon.png')} style={styles.iconUser} />
                    </View>
                    <View>
                        <TextInput placeholder="Password"
                            placeholderTextColor="#B8B4B8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry style={[styles.input, styles.shadow]} />
                        <Image source={require('../assets/images/lock_icon.png')} style={styles.iconLock} />
                    </View>
                    <View style={styles.rememberMeContainer}>
                        <TouchableOpacity style={[styles.checkbox, rememberMe ? styles.checkboxChecked : null]} onPress={toggleRememberMe}></TouchableOpacity>
                        <Text style={styles.rememberMeText}>SE SOUVENIR DE MOI</Text>
                    </View>
                    <TouchableOpacity style={[styles.button, styles.shadow]} onPress={submitForm}>
                        <Image source={require("../assets/images/check_icon.png")} style={styles.buttonImage} />
                    </TouchableOpacity>
                    <View style={styles.inscriptionText}>
                        <Text style={{ fontSize: normalize(18), color: 'white' }}>Tu n'as pas de compte? </Text>
                        <TouchableOpacity
                            // @ts-ignore
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={{ fontSize: normalize(18), color: '#406DE1', textDecorationLine: 'underline' }}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </DismissKeyboard>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    imageLogo: {
        width: normalize(324),
        height: normalize(162),
        alignSelf: 'center',
        marginBottom: '25%'
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
    text: {
        fontWeight: 'bold',
        fontSize: normalize(29),
        alignSelf: 'center',
        color: 'white',
        marginBottom: 8
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: {
            width: 2,
            height: 3,
        },
        shadowOpacity: 0.50,
        shadowRadius: 3.84,
        elevation: 5
    },
    versionText: {
        position: 'absolute',
        top: 40,
        right: 20,
        color: 'gray',
        fontWeight: 'bold',
        fontSize: normalize(17)
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: '5%',
        marginTop: normalize(10)
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10
    },
    rememberMeText: {
        fontWeight: 'bold',
        fontSize: normalize(19),
        color: 'white'
    },
    checkboxChecked: {
        backgroundColor: 'white'
    },
    inscriptionText: {
        flexDirection: 'row',
        alignSelf: 'center',
        bottom: normalize(-98)
    }
})