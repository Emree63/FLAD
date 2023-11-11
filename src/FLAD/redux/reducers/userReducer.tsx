import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../../model/User";
import { userTypes } from "../types/userTypes";

const initialState = {
  user: User,
  isLogedIn: false,
  loading: false,
  failedLogin: false,
  failedSignup: false,
  errorMessage: null,
  errorNetwork: false,
  dark: null,
  errorEmptyMusic: false,
  accessError: false,
  errorUpdateMessage: null,
  errorUpdate: false,
}

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case userTypes.RESTORE_TOKEN:
      return {
        ...state,
        loading: true,
      };
    case userTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
        isLogedIn: true,
        failedLogin: false,
        failedSignup: false,
        errorNetwork: false
      };
    case userTypes.USER_LOGOUT:
      AsyncStorage.removeItem('dark');
      return {
        ...state,
        user: null,
        isLogedIn: false,
        dark: null
      }
    case userTypes.SAVE_SPOTIFY:
      return {
        ...state,
        userSpotifyToken: action.payload
      };
    case userTypes.SET_ERROR_LOGIN:
      return { ...state, failedLogin: action.payload }
    case userTypes.SET_ERROR_SIGNUP:
      return { ...state, failedSignup: true, errorMessage: action.payload }
    case userTypes.SET_DARK_MODE:
      return { ...state, dark: action.payload }
    case userTypes.SET_ERROR_NETWORK:
      return { ...state, errorNetwork: action.payload }
    case userTypes.SET_ERROR_EMPTY_MUSIC:
      return { ...state, errorEmptyMusic: action.payload }
    case userTypes.SET_ERROR_ACCESS:
      return { ...state, accessError: action.payload }
    case userTypes.SET_ERROR_UPDATE:
      return { ...state, errorUpdate: action.payload }
    case userTypes.SET_ERROR_UPDATE_MESSAGE:
      return { ...state, errorUpdateMessage: action.payload, errorUpdate: true }
    default:
      return state;
  }
}


export default userReducer;