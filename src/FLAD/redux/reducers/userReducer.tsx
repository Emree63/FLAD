import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../../Model/User";
import { userTypes } from "../types/userTypes";

const initialState = {
  loading: false,
  user: User,
  userFladToken: "",
  userSpotifyToken: null,
  error: null,
  isLogedIn: false,
  failedLogin: false,
  failedSignup: false,
  dark: null
}

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case userTypes.RESTORE_TOKEN:
      const resp = (action.payload == "" ? false : true)
      return {
        ...state,
        userFladToken: action.payload,
        loading: true,
        isLogedIn: resp,
      };
    case userTypes.LOGIN:
      AsyncStorage.setItem('dark', JSON.stringify(false)).then(() => { });
      return {
        ...state,
        user: action.payload,
        failedLogin: false,
        isLogedIn: true,
        dark: false
      };
    case userTypes.SIGNUP:
      AsyncStorage.setItem('dark', JSON.stringify(false)).then(() => { });
      return {
        ...state,
        user: action.payload,
        failedSignup: false,
        isLogedIn: true,
        dark: false
      };
    case userTypes.USER_LOGOUT:
      AsyncStorage.removeItem('dark').then(() => { });
      return {
        ...state,
        user: null,
        isLogedIn: false
      }
    case userTypes.SAVE_SPOTIFY:
      return {
        ...state,
        userSpotifyToken: action.payload,
      };
    case userTypes.CHANGE_ERROR_LOGIN:
      return { ...state, failedLogin: true }
    case userTypes.CHANGE_ERROR_SIGNUP:
      return { ...state, failedSignup: true }
    case userTypes.CHANGE_MODE:
      return { ...state, dark: action.payload }
    default:
      return state;
  }
}
export default userReducer

