import Music from "../../model/Music";
import { Spot } from "../../model/Spot";
import { favoritesTypes } from "../types/favoritesTypes";
import { spotifyTypes } from "../types/spotifyTypes";

export const setUserCurrentMusic = (music: Music | null) => {
  return {
    type: spotifyTypes.GET_USER_CURRENT_MUSIC,
    payload: music,
  };
}

export const setFavoriteMusic = (spots: Spot[]) => {
  return {
    type: favoritesTypes.GET_FAVORITE_MUSICS,
    payload: spots,
  };
}