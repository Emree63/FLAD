import axios from "axios";
import configs from "../../constants/config";
import { LoginCredentials, RegisterCredentials, restoreToken, userLogin, userLogout, setErrorLogin, setErrorSignup, setErrorNetwork } from "../actions/userActions";
import * as SecureStore from 'expo-secure-store';
import { UserMapper } from "../../models/mapper/UserMapper";
import { MusicServiceProvider } from "../../models/MusicServiceProvider";

const keyRemember = 'rememberUser';

export const register = (registerCredential: RegisterCredentials) => {
  //@ts-ignore
  return async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const resp = await axios.post(
        configs.API_URL + '/auth/register',
        registerCredential,
        config
      )
      const token = resp.data.token;
      await SecureStore.setItemAsync(configs.key, token);
      await SecureStore.setItemAsync(keyRemember, 'true');
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      const user = await axios.get(
        configs.API_URL + '/user',
        { headers }
      )
      MusicServiceProvider.initSpotify(user.data.data.tokenSpotify, user.data.data.idSpotify);
      dispatch(userLogin(UserMapper.toModel(user.data.data)));
    } catch (error: any) {
      switch (error.response.status) {
        case 400:
          dispatch(setErrorSignup("Email non valide !"));
          break;
        case 409:
          dispatch(setErrorSignup("Email, Spotify ou nom déjà utilisé !"));
          break;
        case 500:
          dispatch(setErrorSignup("Compte Spotify non autorisé !"));
          break;
        default:
          console.error("Error : " + error.message);
          dispatch(setErrorSignup("Erreur lors de l'inscription !"));
          break;
      }
    }
  }
}

export const login = (loginCredential: LoginCredentials, remember: boolean) => {
  //@ts-ignore
  return async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const resp = await axios.post(
        configs.API_URL + '/auth/login',
        loginCredential,
        config
      )

      const token = resp.data.token;
      await SecureStore.setItemAsync(configs.key, token);
      if (remember) {
        await SecureStore.setItemAsync(keyRemember, remember.toString());
      }

      const headers = {
        'Authorization': 'Bearer ' + token
      };

      const user = await axios.get(
        configs.API_URL + '/user',
        { headers }
      )
      MusicServiceProvider.initSpotify(user.data.data.tokenSpotify, user.data.data.idSpotify);
      dispatch(userLogin(UserMapper.toModel(user.data.data)));
    } catch (error: any) {
      switch (error.response.status) {
        case 400:
          dispatch(setErrorLogin(true));
          break;
        default:
          console.error("Error : " + error.message);
          dispatch(setErrorNetwork(true));
          break;
      }
    }
  }
}

export const getRefreshToken = () => {
  //@ts-ignore
  return async dispatch => {
    let remember: string | null = await SecureStore.getItemAsync(keyRemember);
    let token: string | null = await SecureStore.getItemAsync(configs.key);
    if (token) {
      if (remember) {
        const headers = {
          'Authorization': 'Bearer ' + token
        };
        try {
          const user = await axios.get(
            configs.API_URL + '/user',
            { headers }
          )
          MusicServiceProvider.initSpotify(user.data.data.tokenSpotify, user.data.data.idSpotify);
          await dispatch(userLogin(UserMapper.toModel(user.data.data)));
        } catch (error: any) {
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
    }
    dispatch(restoreToken());

  }
}

export const deleteUser = () => {
  //@ts-ignore
  return async dispatch => {
    let token: string | null = await SecureStore.getItemAsync(configs.key);
    if (token) {
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      try {
        await axios.delete(
          configs.API_URL + '/user',
          { headers }
        )
        dispatch(logout());
      } catch (error: any) {
        console.error("Error deleting account : " + error.message);
      }
    }
  }
}

export const logout = () => {
  //@ts-ignore
  return async dispatch => {
    await SecureStore.deleteItemAsync(configs.key);
    await SecureStore.deleteItemAsync(keyRemember);
    MusicServiceProvider.resetService();
    dispatch(userLogout());
  }
}