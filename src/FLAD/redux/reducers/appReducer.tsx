import { Spot } from "../../models/Spot";
import { favoritesTypes } from "../types/favoritesTypes";
import { spotifyTypes } from "../types/spotifyTypes";
import { spotTypes } from "../types/spotTypes";
import { userTypes } from "../types/userTypes";

const initialState = {
  spot: [] as Spot[],
  favoriteMusic: [] as Spot[],
  userCurrentMusic: null,
  nbAddedFavoriteMusic: 0
}

const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case favoritesTypes.GET_FAVORITE_MUSICS:
      return { ...state, favoriteMusic: action.payload };
    case spotTypes.FETCH_SPOT:
      const uniqueSpots = action.payload.filter((spot: Spot) => {
        return !state.spot.some((s) => s.user === spot.user && s.music.id === spot.music.id);
      });
      const updatedSpotList = [...uniqueSpots, ...state.spot];
      return { ...state, spot: updatedSpotList };
    case spotTypes.REMOVE_SPOT:
      return { ...state, spot: state.spot.filter((spot) => spot.user !== action.payload.user && spot.music.id !== action.payload.music.id) };
    case spotifyTypes.GET_USER_CURRENT_MUSIC:
      return { ...state, userCurrentMusic: action.payload };
    case userTypes.USER_LOGOUT:
      return { ...state, spot: [], favoriteMusic: [], userCurrentMusic: null, nbAddedFavoriteMusic: 0 };
    default:
      return state;
  }
}

export default appReducer