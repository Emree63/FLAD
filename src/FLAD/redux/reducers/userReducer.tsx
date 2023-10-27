import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../../model/User";
import { userTypes } from "../types/userTypes";

const initialState = {
  user: User,
  userFladToken: "",
  userSpotifyToken: null,
  isLogedIn: false,
  failedLogin: false,
  failedSignup: false,
  errorNetwork: false,
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
      return {
        ...state,
        user: action.payload,
        isLogedIn: true
      };
    case userTypes.SIGNUP:
      return {
        ...state,
        user: action.payload,
        isLogedIn: true,
        dark: false
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
      return { ...state, failedSignup: action.payload }
    case userTypes.DARK_MODE:
      return { ...state, dark: action.payload }
    case userTypes.ERROR_NETWORK:
      return { ...state, errorNetwork: action.payload }
    default:
      return state;
  }
}
export default userReducer

