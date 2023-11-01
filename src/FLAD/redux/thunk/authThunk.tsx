import axios from "axios";
import configs from "../../constants/config";
import { LoginCredentials, RegisterCredentials, restoreToken, userLogin, userLogout, userSignUp, setErrorLogin, setErrorSignup, setErrorNetwork } from "../actions/userActions";
import * as SecureStore from 'expo-secure-store';
import { UserMapper } from "../../models/mapper/UserMapper";

const key = 'userToken';
const keyRemember = 'rememberUser';

export const register = (resgisterCredential: RegisterCredentials) => {
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
        resgisterCredential,
        config
      )
      const token = resp.data.token;
      await SecureStore.setItemAsync(key, token);
      await SecureStore.setItemAsync(keyRemember, 'true');
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      const user = await axios.get(
        configs.API_URL + '/user',
        { headers }
      )
      dispatch(userSignUp(UserMapper.toModel(user.data.data)));

    } catch (error: any) {
      console.error("Error : " + error.message);
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
      await SecureStore.setItemAsync(key, token);
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
      dispatch(userLogin(UserMapper.toModel(user.data.data)));

    } catch (error: any) {
      console.error("Error : " + error.message);
      switch (error.response.status) {
        case 400:
          dispatch(setErrorLogin(true));
          break;
        default:
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
    let token: string | null = await SecureStore.getItemAsync(key);
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
          await dispatch(userLogin(UserMapper.toModel(user.data.data)));
        } catch (error: any) {
          await SecureStore.deleteItemAsync(key);
          dispatch(userLogout());
        }
      } else {
        await SecureStore.deleteItemAsync(key);
        dispatch(userLogout());
      }
    }
    dispatch(restoreToken());

  }
}

export const deleteUser = () => {
  //@ts-ignore
  return async dispatch => {
    let token: string | null = await SecureStore.getItemAsync(key);
    if (token) {
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      try {
        await axios.delete(
          configs.API_URL + '/user',
          { headers }
        )
        await SecureStore.deleteItemAsync(key);
        dispatch(userLogout());
      } catch (error: any) {
        console.error("Error deleting account : " + error.message);
      }
    }
  }
}

export const logout = () => {
  //@ts-ignore
  return async dispatch => {
    await SecureStore.deleteItemAsync(key);
    await SecureStore.deleteItemAsync(keyRemember);
    dispatch(userLogout());
  }
}