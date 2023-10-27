import { User } from "../../model/User";
import { userTypes } from "../types/userTypes";

export interface LoginCredentials {
  email: string,
  password: string
}

export interface RegisterCredentials {
  email: string,
  password: string,
  name: string,
  idFlad: string,
  idSpotify: string
}

export const setLoginState = (userJson: any) => {
  const user = new User(userJson.data.idFlad, userJson.data.idSpotify, userJson.data.email, new Date(), userJson.data.name, userJson.data.image);
  return {
    type: userTypes.LOGIN,
    payload: user
  };
}

export const restoreToken = (token: string) => {
  return {
    type: userTypes.RESTORE_TOKEN,
    payload: token
  };
}

export const userSignUp = (user: User) => {
  return {
    type: userTypes.SIGNUP,
    payload: user
  };
}

export const userLogout = () => {
  return {
    type: userTypes.USER_LOGOUT,
  };
}

export const setDarkMode = (value: boolean) => {
  return {
    type: userTypes.DARK_MODE,
    payload: value
  };
}

export const setErrorLogin = (value: boolean) => {
  return {
    type: userTypes.ERROR_LOGIN,
    payload: value
  };
}

export const setErrorSignup = (value: boolean) => {
  return {
    type: userTypes.ERROR_SIGNUP,
    payload: value
  };
}

export const setErrorNetwork = (value: boolean) => {
  return {
    type: userTypes.ERROR_NETWORK,
    payload: value
  };
}