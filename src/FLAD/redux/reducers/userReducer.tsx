import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../../models/User";
import { userTypes } from "../types/userTypes";

const initialState = {
  user: User,
  isLogedIn: false,
  loading: false,
  failedLogin: false,
  failedSignup: false,
  errorMessage: null,
  errorNetwork: false,
  dark: null
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
    case userTypes.SIGNUP:
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
    case userTypes.ERROR_LOGIN:
      return { ...state, failedLogin: action.payload }
    case userTypes.ERROR_SIGNUP:
      return { ...state, failedSignup: true, errorMessage: action.payload }
    case userTypes.DARK_MODE:
      return { ...state, dark: action.payload }
    case userTypes.ERROR_NETWORK:
      return { ...state, errorNetwork: action.payload }
    default:
      return state;
  }
}


export default userReducer;