import { spotsData } from "../../data/data";
import Music from "../../model/Music";
import { Spot } from "../../model/Spot";
import { discoveriesTypes } from "../types/discoverieTypes";
import { favoritesTypes } from "../types/favoritesTypes";
import { spotifyTypes } from "../types/spotifyTypes";
import { spotTypes } from "../types/spotTypes";

const initialState = {
  spot: spotsData,
  favoriteMusic: [] as Music[],
  userCurrentMusic: null
}

const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case favoritesTypes.GET_FAVORITE_MUSICS:
      return { ...state, favoriteMusic: action.payload };
    case favoritesTypes.ADD_FAVORITE_MUSICS:
      return { ...state, favoriteMusic: [action.payload, ...state.favoriteMusic] };
    case favoritesTypes.REMOVE_FAVORITE_MUSICS:
      return { ...state, favoriteMusic: state.favoriteMusic };
    case spotTypes.FETCH_SPOT:
      const uniqueSpots = action.payload.filter((spot) => {
        return !state.spot.some((s) => s.userSpotifyId === spot.userSpotifyId && s.music.id === spot.music.id);
      });
      const updatedSpotList = [...uniqueSpots, ...state.spot];
      return { ...state, spot: updatedSpotList };
    case spotTypes.REMOVE_SPOT:
      return { ...state, spot: state.spot.filter((spot) => spot.userSpotifyId !== action.payload.userSpotifyId && spot.music.id !== action.payload.music.id) };
    case discoveriesTypes.FETCH_DISCOVERIES:
      return;
    case spotifyTypes.GET_USER_CURRENT_MUSIC:
      return { ...state, userCurrentMusic: action.payload };
    default:
      return state;
  }
}

export default appReducer