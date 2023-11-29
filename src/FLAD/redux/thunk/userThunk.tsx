import axios from "axios";
import configs from "../../constants/config";
import { setDarkMode, setErrorUpdateMessage, userLogin } from "../actions/userActions";
import * as SecureStore from 'expo-secure-store';
import { UserMapper } from "../../models/mapper/UserMapper";

export const darkMode = (value: boolean) => {
    //@ts-ignore
    return async dispatch => {
        dispatch(setDarkMode(value));
    }
}

export const setName = (name: string) => {
    //@ts-ignore
    return async dispatch => {
        try {
            let token: string | null = await SecureStore.getItemAsync(configs.key);
            const headers = {
                'Authorization': 'Bearer ' + token
            };
            await axios.put(configs.API_URL + '/user/name', { name }, { headers });

            const user = await axios.get(
                configs.API_URL + '/user',
                { headers }
            )
            dispatch(userLogin(UserMapper.toModel(user.data.data)));

        } catch (error: any) {
            switch (error.response.status) {
                case 409:
                    dispatch(setErrorUpdateMessage("Nom déjà utilisé."))
                    break;
                default:
                    console.error("Error : " + error.message);
                    break;
            }
        }
    }
}

export const setMail = (email: string) => {
    //@ts-ignore
    return async dispatch => {
        try {
            let token: string | null = await SecureStore.getItemAsync(configs.key);
            const headers = {
                'Authorization': 'Bearer ' + token
            };

            await axios.put(configs.API_URL + '/user/email', { email }, { headers });

            const user = await axios.get(
                configs.API_URL + '/user',
                { headers }
            )
            dispatch(userLogin(UserMapper.toModel(user.data.data)));
        } catch (error: any) {
            switch (error.response.status) {
                case 409:
                    dispatch(setErrorUpdateMessage("Email déjà utilisé."))
                    break;
                default:
                    console.error("Error : " + error.message);
                    break;
            }
        }
    }
}

export const setPassword = (oldPassword: string, newPassword: string) => {
    //@ts-ignore
    return async dispatch => {
        try {
            let token: string | null = await SecureStore.getItemAsync(configs.key);
            const headers = {
                'Authorization': 'Bearer ' + token
            };
            await axios.put(configs.API_URL + '/user/password', { oldPassword, newPassword }, { headers });

        } catch (error: any) {
            switch (error.response.status) {
                case 500:
                    dispatch(setErrorUpdateMessage("Mot de passe incorrect."))
                    break;
                default:
                    console.error("Error : " + error.message);
                    break;
            }
        }
    }
}

export const setImage = (image: string) => {
    //@ts-ignore
    return async dispatch => {
        try {
            let token: string | null = await SecureStore.getItemAsync(configs.key);
            const headers = {
                'Authorization': 'Bearer ' + token
            };

            await axios.put(configs.API_URL + '/user/image', { image }, { headers });

            const user = await axios.get(
                configs.API_URL + '/user',
                { headers }
            )
            dispatch(userLogin(UserMapper.toModel(user.data.data)));
        } catch (error: any) {
            switch (error.response.status) {
                case 413:
                    dispatch(setErrorUpdateMessage("Taille de l'image trop grande :\n" + image.length / 1000 + " Ko. Max 100 Ko."))
                    break;
                default:
                    console.error("Error : " + error.message);
                    break;
            }
        }
    }
}