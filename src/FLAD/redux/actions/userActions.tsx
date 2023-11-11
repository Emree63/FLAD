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

export const userLogout = () => {
  return {
    type: userTypes.USER_LOGOUT,
  };
}

export const setDarkMode = (value: boolean) => {
  return {
    type: userTypes.SET_DARK_MODE,
    payload: value
  };
}

export const setErrorLogin = (value: boolean) => {
  return {
    type: userTypes.SET_ERROR_LOGIN,
    payload: value
  };
}

export const setErrorSignup = (value: string) => {
  return {
    type: userTypes.SET_ERROR_SIGNUP,
    payload: value
  };
}

export const setErrorNetwork = (value: boolean) => {
  return {
    type: userTypes.SET_ERROR_NETWORK,
    payload: value
  };
}

export const setErrorEmptyMusic = (value: boolean) => {
  return {
    type: userTypes.SET_ERROR_EMPTY_MUSIC,
    payload: value
  };
}

export const setAccessError = (value: boolean) => {
  return {
    type: userTypes.SET_ERROR_ACCESS,
    payload: value
  };
}

export const setErrorUpdate = (value: boolean) => {
  return {
    type: userTypes.SET_ERROR_UPDATE,
    payload: value
  };
}

export const setErrorUpdateMessage = (value: string) => {
  return {
    type: userTypes.SET_ERROR_UPDATE_MESSAGE,
    payload: value
  };
}