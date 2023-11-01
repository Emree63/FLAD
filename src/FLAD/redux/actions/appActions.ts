import Music from "../../models/Music";
import { favoritesTypes } from "../types/favoritesTypes";

export const getFavoritesMusic = (music: Music[]) => {
  return {
    type: favoritesTypes.GET_FAVORITE_MUSICS,
    payload: music,
  };
}

export const addFavoritesMusic = (music: Music) => {
  return {
    type: favoritesTypes.ADD_FAVORITE_MUSICS,
    payload: music,
  };
}