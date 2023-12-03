import { Spot } from "../../models/Spot";
import { favoritesTypes } from "../types/favoritesTypes";
import { spotifyTypes } from "../types/spotifyTypes";
import { spotTypes } from "../types/spotTypes";
import { userTypes } from "../types/userTypes";

const initialState = {
  spot: [] as Spot[],
  favoriteMusic: [] as Spot[],
  userCurrentMusic: null,
  nbAddedFavoriteMusic: 0,
  oldSpot: [] as String[],
}

const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case favoritesTypes.GET_FAVORITE_MUSICS:
      return { ...state, favoriteMusic: action.payload };
    case favoritesTypes.ADD_FAVORITE_MUSICS:
      return {
        ...state, favoriteMusic: [...state.favoriteMusic, action.payload],
        nbAddedFavoriteMusic: state.nbAddedFavoriteMusic + 1
      };
    case favoritesTypes.RESET_NB_ADDED_FAVORITE_MUSIC:
      return { ...state, nbAddedFavoriteMusic: 0 };
    case spotTypes.FETCH_SPOT:
      const uniqueSpots = action.payload.filter((spot: Spot) => {
        const spotKey = `${spot.user}_${spot.music.id}`;
        return !state.oldSpot.includes(spotKey);
      });

      const updatedSpotList = [...uniqueSpots, ...state.spot];
      const updatedOldSpotList = [...state.oldSpot, ...uniqueSpots.map((spot: Spot) => `${spot.user}_${spot.music.id}`)];

      return { ...state, spot: updatedSpotList, oldSpot: updatedOldSpotList };
    case spotTypes.REMOVE_SPOT:
      return { ...state, spot: state.spot.filter((spot) => spot.user !== action.payload.user && spot.music.id !== action.payload.music.id) };
    case spotifyTypes.GET_USER_CURRENT_MUSIC:
      return { ...state, userCurrentMusic: action.payload };
    case userTypes.USER_LOGOUT:
      return { ...state, spot: [], favoriteMusic: [], userCurrentMusic: null, nbAddedFavoriteMusic: 0, oldSpot: [] };
    default:
      return state;
  }
}

export default appReducer