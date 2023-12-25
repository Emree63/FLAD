import Conversation from "../../models/Conversation";
import Message from "../../models/Message";
import Music from "../../models/Music";
import { Spot } from "../../models/Spot";
import { chatTypes } from "../types/chatTypes";
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

export const addFavoriteMusic = (spot: Spot) => {
  return {
    type: favoritesTypes.ADD_FAVORITE_MUSICS,
    payload: spot,
  };
}

export const resetNbAddedFavoriteMusic = () => {
  return {
    type: favoritesTypes.RESET_NB_ADDED_FAVORITE_MUSIC
  };
}

export const setConversations = (conversations: Conversation[]) => {
  return {
    type: chatTypes.FETCH_CONVERSATIONS,
    payload: conversations,
  };
}

export const setMessages = (messages: Message[]) => {
  return {
    type: chatTypes.FETCH_MESSAGES,
    payload: messages,
  };
}