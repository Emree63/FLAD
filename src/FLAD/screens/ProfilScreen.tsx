import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Svg, Path } from 'react-native-svg';
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import normalize from '../components/Normalize';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import { deleteUser } from '../redux/thunk/authThunk';
import { setImage, setMail, setName, setPassword } from '../redux/thunk/userThunk';
import { setErrorUpdate } from '../redux/actions/userActions';
import * as FileSystem from 'expo-file-system';

// @ts-ignore
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

export default function ProfilScreen() {
    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);
    // @ts-ignore
    const errorUpdateMessage = useSelector(state => state.userReducer.errorUpdateMessage);
    // @ts-ignore
    const errorUpdate = useSelector(state => state.userReducer.errorUpdate);
    // @ts-ignore
    const userCurrent = useSelector(state => state.userReducer.user);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const style = isDark ? colorsDark : colorsLight;
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const dispatch = useDispatch();

    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    const deleteAccount = () => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer votre compte ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Oui',
                    //@ts-ignore
                    onPress: () => dispatch(deleteUser()),
                    style: 'destructive'
                },
            ],
            { cancelable: false }
        );
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 0.2,
        });

        if (result.assets !== null) {
            const base64Image = await convertImageToBase64(result.assets[0].uri);
            //@ts-ignore
            dispatch(setImage(base64Image));
        }
    };

    const convertImageToBase64 = async (imageUri: any) => {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return `data:image/jpg;base64,${base64}`;
    };

    const submitUsername = () => {
        const isUsernameValid = /^\w+$/.test(username);

        if (username.length > 30) {
            Alert.alert("Erreur modification", "Le nom d'utilisateur ne peut pas être plus grand que 30 caractères.");
            return;
        }
        if (!isUsernameValid) {
            Alert.alert("Erreur modification", "Le nom d'utilisateur ne peut pas posséder de caractères spéciaux.");
            return;
        }
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir changer de nom d\'utilisateur ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Oui',
                    onPress: () => {
                        //@ts-ignore
                        dispatch(setName(username));
                        setUsername("");
                    },
                    style: 'destructive'
                },
            ],
            { cancelable: false }
        );
    }

    const submitEmail = () => {
        const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

        if (email.length > 100) {
            Alert.alert("Erreur modification", "L'adresse e-mail ne peut pas être plus grand que 100 caractères.");
            return;
        }
        if (!isEmailValid) {
            Alert.alert("Erreur modification", "L'adresse e-mail n\'est pas valide.");
            return;
        }
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir changer l\'adresse e-mail ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Oui',
                    onPress: () => {
                        //@ts-ignore
                        dispatch(setMail(email));
                        setEmail("");
                    },
                    style: 'destructive'
                },
            ],
            { cancelable: false }
        );
    }

    const submitPassword = () => {
        //@ts-ignore
        dispatch(setPassword(oldPassword, newPassword));
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    useEffect(() => {
        if (errorUpdate) {
            Alert.alert(
                "Erreur modification",
                errorUpdateMessage,
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            dispatch(setErrorUpdate(false))
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    }, [errorUpdate]);

    const styles = StyleSheet.create({
        mainSafeArea: {
            flex: 1,
            backgroundColor: style.body,
        },
        container: {
            marginTop: 20,
            marginHorizontal: normalize(25),
            flex: 1,
            backgroundColor: style.body,
        },
        buttonSetting: {
            width: normalize(11),
            height: normalize(18),
            marginRight: 5
        },
        modalContent: {
            position: 'absolute',
            top: '5%',
            left: '-5%',
            right: '-5%',
            height: '100%',
            backgroundColor: style.body,
            borderRadius: 12
        },
        modalView: {
            flexDirection: 'row',
            marginTop: 20,
            marginLeft: 30,
            marginBottom: normalize(45)
        },
        exit: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        textExit: {
            fontSize: normalize(20),
            color: '#454545',
            fontWeight: 'bold'
        },
        profilHead: {
            alignItems: 'center',
        },
        title: {
            fontSize: normalize(30),
            fontWeight: 'bold',
            color: style.Text,
        },
        imageWrapper: {
            width: 126,
            height: 126,
            borderRadius: 63,
            borderWidth: 3,
            borderColor: style.Text,
            overflow: 'hidden',
            marginVertical: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        imageProfil: {
            width: 120,
            height: 120,
        },
        body: {
            paddingVertical: 9,
            paddingLeft: normalize(10),
            backgroundColor: style.Card,
            borderRadius: 13,
            alignItems: 'flex-start',
            marginBottom: normalize(45)
        },
        textOption: {
            fontSize: normalize(18),
            color: style.Text,
            fontWeight: 'bold',
            marginLeft: 12
        },
        deleteOption: {
            paddingVertical: 9,
            paddingLeft: 5,
            backgroundColor: style.Card,
            borderRadius: 13,
            flexDirection: 'row',
            alignItems: 'center',
        },
        textOptionPassword: {
            fontSize: normalize(18),
            color: '#1c77fb',
            marginLeft: 12
        },
        buttonDeleteOption: {
            backgroundColor: '#DF0404',
            padding: 5,
            borderRadius: 10,
            marginLeft: 15
        },
        textDeleteOption: {
            fontSize: normalize(18),
            color: '#F80404',
            marginLeft: 12
        },
        optionId: {
            flexDirection: 'row',
            marginBottom: 20,
        },
        optionMail: {
            flexDirection: 'row',
        },
        textInputId: {
            marginLeft: 50,
            width: '50%',
            color: style.Text,
            fontSize: normalize(18),
        },
        textIdSpotify: {
            marginLeft: 50,
            width: '57%',
            color: style.Text,
            fontWeight: 'bold',
            fontSize: normalize(18),
        },
        textInputMail: {
            marginLeft: 100,
            color: style.Text,
            width: '50%',
            fontSize: normalize(18)
        },
        passwordOption: {
            paddingVertical: 9,
            paddingLeft: normalize(10),
            backgroundColor: style.Card,
            borderRadius: 13,
            alignItems: 'flex-start',
            marginBottom: normalize(45)
        },
        passwordIcon: {
            backgroundColor: '#8e8d92',
            padding: 5,
            paddingHorizontal: 8,
            borderRadius: 10,
            marginLeft: 10
        },
        optionView: {
            flexDirection: 'row',
            marginTop: 5
        },
        cancelText: {
            fontSize: normalize(18),
            color: '#1c77fb'
        },
        updateText: {
            marginLeft: 60,
            fontWeight: 'bold',
            fontSize: normalize(18),
            color: '#404040'
        },
        titlePassword: {
            fontWeight: 'bold',
            fontSize: normalize(20),
            color: style.Text,
            marginLeft: 65
        },
        warning: {
            color: '#98989f',
            fontSize: normalize(15)
        },
        warningView: {
            marginTop: 10,
            paddingHorizontal: 40
        },
        bodyModal: {
            paddingVertical: 12,
            paddingLeft: 30,
            marginHorizontal: normalize(25),
            backgroundColor: style.Card,
            borderRadius: 13,
            alignItems: 'flex-start'
        },
        optionModalWithUnderline: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: style.Line,
            paddingBottom: 10,
            marginBottom: 10
        },
        optionModal: {
            flexDirection: 'row'
        },
        textOptionModal: {
            fontSize: normalize(18),
            color: style.Text,
            fontWeight: 'bold',
        },
        textInputNewModal: {
            marginLeft: 40,
            color: style.Text,
            width: '67.5%',
            fontSize: normalize(18)
        },
        textInputConfirmModal: {
            marginLeft: 30,
            color: style.Text,
            width: '67.5%',
            fontSize: normalize(18)
        },
        textInputOldModal: {
            marginLeft: 55,
            color: style.Text,
            width: '67.5%',
            fontSize: normalize(18)
        }
    })

    return (
        <DismissKeyboard>
            <SafeAreaView style={styles.mainSafeArea}>
                <ScrollView>
                    <View style={styles.container}>
                        <TouchableOpacity
                            // @ts-ignore
                            onPress={() => navigation.navigate('Setting')}>
                            <View style={styles.exit}>
                                <Image style={styles.buttonSetting} source={require('../assets/images/chevron_left_icon.png')} />
                                <Text style={styles.textExit}>Exit</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.profilHead}>
                            <Text style={styles.title}>Profil</Text>
                            <TouchableOpacity onPress={pickImage} >
                                <View style={styles.imageWrapper}>
                                    <Image source={{ uri: userCurrent.image }} style={styles.imageProfil} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.body}>
                            <View style={styles.optionId}>
                                <Text style={styles.textOption}>Id. Spotify</Text>
                                <Text style={styles.textIdSpotify} numberOfLines={1}>{userCurrent.idSpotify}</Text>
                            </View>
                            <View style={styles.optionId}>
                                <Text style={styles.textOption}>Identifiant</Text>
                                <TextInput placeholderTextColor='#828288' value={username}
                                    onChangeText={setUsername} placeholder={userCurrent.name} style={styles.textInputId} />
                                {username.length >= 5 && (
                                    <TouchableOpacity onPress={() => submitUsername()}>
                                        <Image source={require("../assets/images/confirm_icon.png")} style={{ width: normalize(25), height: normalize(25) }} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={styles.optionMail}>
                                <Text style={styles.textOption}>Mail</Text>
                                <TextInput placeholderTextColor='#828288' value={email}
                                    onChangeText={setEmail} placeholder={userCurrent.email} style={styles.textInputMail} />
                                {email.length >= 7 && (
                                    <TouchableOpacity onPress={() => submitEmail()}>
                                        <Image source={require("../assets/images/confirm_icon.png")} style={{ width: normalize(25), height: normalize(25) }} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <View style={styles.passwordOption}>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={handleModal}>
                                <View style={styles.passwordIcon}>
                                    <Svg width="14" height="20" viewBox="0 0 14 26" >
                                        <Path fill-rule="evenodd" clip-rule="evenodd" d="M3.27129 1.75541C4.23026 1.10258 5.34904 0.723459 6.50733 0.658814C7.66563 0.594169 8.81964 0.846441 9.84531 1.38851C10.7879 1.8833 11.593 2.6042 12.1889 3.48739C12.9939 4.70913 13.3604 6.16796 13.2283 7.62511C13.0962 9.08225 12.4733 10.4514 11.4617 11.5084C11.031 11.9508 10.5387 12.3292 9.99839 12.6274L10.1591 14.3578L9.96312 14.9126L9.00438 15.8973L10.5193 17.3723L10.5326 18.3689L9.05762 19.8838L10.5725 21.3588L10.5858 22.3554L7.63588 25.3852L6.63925 25.3985L4.30933 23.13L4.09638 22.6355L3.96398 12.721C3.36598 12.4165 2.82055 12.0182 2.34835 11.5414C1.68473 10.8774 1.17578 10.0751 0.857766 9.19177C0.539757 8.30846 0.420525 7.36587 0.508571 6.4312C0.596616 5.49652 0.88977 4.59278 1.36714 3.78439C1.8445 2.976 2.49533 2.28386 3.27129 1.75541ZM11.8389 7.50421C11.9428 6.36957 11.6584 5.23325 11.0323 4.28134L11.0412 4.28222C10.5801 3.58952 9.95326 3.02302 9.21756 2.63419C8.48185 2.24536 7.66065 2.04653 6.82857 2.05576C5.99649 2.06499 5.1799 2.28199 4.453 2.68704C3.72611 3.0921 3.11195 3.67236 2.66632 4.37512C2.07477 5.33215 1.8204 6.45957 1.94372 7.57788C2.06704 8.69619 2.56095 9.7411 3.34682 10.5462C3.79752 11.0047 4.33268 11.3684 4.92505 11.6127L5.36528 12.2577L5.5017 22.3236L7.1176 23.8969L9.08424 21.8771L7.56933 20.4021L7.55602 19.4055L9.031 17.8905L7.5161 16.4156L7.50279 15.4189L8.72702 14.1616L8.56231 12.2778L8.97256 11.5736C9.52979 11.3206 10.0346 10.9652 10.4608 10.526C11.249 9.70384 11.7349 8.63846 11.8389 7.50421ZM8.25568 5.66411C8.22318 5.47735 8.15334 5.29906 8.05034 5.13991C7.94734 4.98077 7.8133 4.84403 7.65623 4.73789C7.49916 4.63174 7.3223 4.55837 7.13622 4.52216C6.95014 4.48596 6.75867 4.48765 6.57326 4.52716C6.38785 4.56666 6.21232 4.64315 6.05716 4.75206C5.902 4.86098 5.7704 5.00007 5.67024 5.16101C5.57007 5.32196 5.50341 5.50146 5.47422 5.68877C5.44503 5.87608 5.45393 6.06735 5.50038 6.25114C5.58972 6.60469 5.81261 6.90986 6.12222 7.10253C6.43182 7.29521 6.80405 7.3604 7.16071 7.28441C7.51737 7.20843 7.8307 6.99717 8.03488 6.69503C8.23906 6.39289 8.31821 6.02337 8.25568 5.66411Z" fill="white" />
                                    </Svg>
                                </View>
                                <View style={styles.optionView}>
                                    <Text style={styles.textOptionPassword}>Modifier le mot de passe</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.deleteOption}>
                            <View style={styles.buttonDeleteOption}>
                                <Svg width="20" height="20" viewBox="0 0 29 29">
                                    <Path d="M10.8157 22.6797C10.3586 22.6797 10.0657 22.4101 10.0422 21.9648L9.69067 9.0625C9.67895 8.62891 9.97192 8.34765 10.4407 8.34765C10.8743 8.34765 11.179 8.61719 11.1907 9.05078L11.5657 21.9648C11.5774 22.3984 11.2727 22.6797 10.8157 22.6797ZM14.3899 22.6797C13.9328 22.6797 13.6164 22.3984 13.6164 21.9648V9.0625C13.6164 8.62891 13.9328 8.34765 14.3899 8.34765C14.8469 8.34765 15.175 8.62891 15.175 9.0625V21.9648C15.175 22.3984 14.8469 22.6797 14.3899 22.6797ZM17.9758 22.6797C17.5188 22.6797 17.2141 22.3984 17.2258 21.9648L17.5891 9.0625C17.6008 8.61719 17.9055 8.34765 18.3391 8.34765C18.8078 8.34765 19.1008 8.62891 19.0891 9.0625L18.7375 21.9648C18.7141 22.4101 18.4211 22.6797 17.9758 22.6797ZM9.24536 5.5H11.1086V2.99219C11.1086 2.32422 11.5774 1.89062 12.2805 1.89062H16.4758C17.1789 1.89062 17.6477 2.32422 17.6477 2.99219V5.5H19.5109V2.875C19.5109 1.17578 18.4094 0.144531 16.6047 0.144531H12.1516C10.3469 0.144531 9.24536 1.17578 9.24536 2.875V5.5ZM3.92505 6.4375H24.8664C25.3469 6.4375 25.7336 6.02734 25.7336 5.54687C25.7336 5.06641 25.3469 4.66797 24.8664 4.66797H3.92505C3.4563 4.66797 3.04614 5.06641 3.04614 5.54687C3.04614 6.03906 3.4563 6.4375 3.92505 6.4375ZM9.0227 26.2422H19.7688C21.4445 26.2422 22.5695 25.1523 22.6516 23.4765L23.4719 6.19141H5.30786L6.13989 23.4883C6.22192 25.164 7.32348 26.2422 9.0227 26.2422Z" fill="white" fill-opacity="0.85" />
                                </Svg>
                            </View>
                            <TouchableOpacity onPress={() => deleteAccount()}>
                                <Text style={styles.textDeleteOption}>Supprimer le compte</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal isVisible={isModalVisible}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity onPress={handleModal}>
                                        <View>
                                            <Text style={styles.cancelText}>Annuler</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.titlePassword}>Mot de passe</Text>
                                    <TouchableOpacity
                                        disabled={newPassword.length < 6 || newPassword !== confirmPassword || oldPassword.length < 6}
                                        onPress={() => submitPassword()}>
                                        <View>
                                            <Text style={[styles.updateText, {
                                                color: newPassword.length >= 6 && newPassword === confirmPassword && oldPassword.length >= 6 ? '#1c77fb' : '#404040',
                                            }]}>Modifier</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bodyModal}>
                                    <View style={styles.optionModalWithUnderline}>
                                        <Text style={styles.textOptionModal}>Ancien</Text>
                                        <TextInput placeholderTextColor='#828288' value={oldPassword} secureTextEntry={true}
                                            onChangeText={setOldPassword} placeholder="saisir l'ancien mot de passe" style={styles.textInputOldModal} />
                                    </View>
                                    <View style={styles.optionModalWithUnderline}>
                                        <Text style={styles.textOptionModal}>Nouveau</Text>
                                        <TextInput placeholderTextColor='#828288' value={newPassword} secureTextEntry={true}
                                            onChangeText={setNewPassword} placeholder='saisir le mot de passe' style={styles.textInputNewModal} />
                                    </View>
                                    <View style={styles.optionModal}>
                                        <Text style={styles.textOptionModal}>Confirmer</Text>
                                        <TextInput placeholderTextColor='#828288' value={confirmPassword} secureTextEntry={true}
                                            onChangeText={setConfirmPassword} placeholder='mot de passe' style={styles.textInputConfirmModal} />
                                    </View>
                                </View>
                                <View style={styles.warningView}>
                                    <Text style={styles.warning}>Votre mot de passe doit comporter au moins 6 caractères.</Text>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </DismissKeyboard>
    );
};