import { setDarkMode } from "../actions/userActions";

export const darkMode = (value: boolean) => {
    //@ts-ignore
    return async dispatch => {
        dispatch(setDarkMode(value));
    }
}