import { User } from "../../models/User";
import { userTypes } from "../types/userTypes";

export interface LoginCredentials {
  email: string,
  password: string
}

export interface RegisterCredentials {
  email: string,
  password: string,
  name: string,
  tokenSpotify: string
}

export const userLogin = (user: User) => {
  return {
    type: userTypes.LOGIN,
    payload: user
  };
}

export const restoreToken = () => {
  return {
    type: userTypes.RESTORE_TOKEN
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

export const setErrorSignup = (value: string) => {
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