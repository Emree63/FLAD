import axios from "axios";
import configs from "../../constants/config";
import { LoginCredentials, RegisterCredentials, restoreToken, setLoginState, userLogout, setDarkMode, userSignUp, setErrorLogin, setErrorSignup, setErrorNetwork } from "../actions/userActions";
import * as SecureStore from 'expo-secure-store';
import { UserMapper } from "../../model/mapper/UserMapper";

const key = 'userToken';

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
        configs.API_URL + '/users/register',
        resgisterCredential,
        config
      )

      if (resp.data.token) {
        const token = resp.data.token;
        const headers = {
          'Authorization': 'Bearer ' + token
        };
        const user = await axios.get(
          configs.API_URL + 'api/users',
          { headers }
        )
        dispatch(userSignUp(UserMapper.toModel(user.data)));
      } else {
        dispatch(setErrorSignup(true))
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorNetwork(true));
      } else {
        dispatch(setErrorLogin(true));
      }
    }
  }
}

export const login = (loginCredential: LoginCredentials) => {
  //@ts-ignore
  return async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      console.log(configs.API_URL + '/users/login')
      console.log(loginCredential)
      console.log(config)
      const resp = await axios.post(
        configs.API_URL + '/users/login',
        loginCredential,
        config
      )

      if (resp.data.token) {
        const token = resp.data.token;
        await SecureStore.setItemAsync(key, token);
        const headers = {
          'Authorization': 'Bearer ' + token
        };

        const user = await axios.get(
          configs.API_URL + '/users',
          { headers }
        )
        dispatch(setLoginState(user.data));
      } else {
        console.log('Login Failed', 'Username or Password is incorrect');
        dispatch(setErrorLogin(true));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("axios : " + error.message);
        dispatch(setErrorNetwork(true));
      } else {
        dispatch(setErrorLogin(true));
      }
    }
  }
}

export const getRefreshToken = () => {
  //@ts-ignore
  return async dispatch => {
    try {
      let userToken: string | null = await SecureStore.getItemAsync(key);

      if (userToken) {
        dispatch(restoreToken(userToken));
      } else {
        const empty = "";
        dispatch(restoreToken(empty));
      }
    } catch (e) {
      console.log('Error :', e);
    }
  }
}


export const deleteToken = () => {
  //@ts-ignore
  return async dispatch => {
    try {
      await SecureStore.deleteItemAsync(key);
      dispatch(userLogout());
    } catch (e) {
      console.log('Error deleting token', e);
    }
  }
}

export const darkMode = (value: boolean) => {
  //@ts-ignore
  return async dispatch => {
    dispatch(setDarkMode(value));
  }
}

export const imageUserCurrent = (value: any) => {
  //@ts-ignore
  return async dispatch => {
    //@ts-ignore
    dispatch(setImageUserCurrent(value));
  }
}