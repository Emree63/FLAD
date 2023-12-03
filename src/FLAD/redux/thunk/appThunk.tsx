import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { Spot } from "../../models/Spot";
import configs from "../../constants/config";
import { MusicServiceProvider } from "../../models/MusicServiceProvider";
import { addFavoriteMusic, setFavoriteMusic, setUserCurrentMusic } from "../actions/appActions";
import { setAccessError, setErrorEmptyMusic } from "../actions/userActions";
import { SpotMapper } from "../../models/mapper/SpotMapper";
import { logout } from "./authThunk";
import { removeFromSpotList } from "../actions/spotActions";

export const getUserCurrentMusic = () => {
  //@ts-ignore
  return async dispatch => {
    try {
      let idTrack;
      const resp = await MusicServiceProvider.musicService.getCurrentlyPlayingMusic();
      if (resp === null) {
        idTrack = await MusicServiceProvider.musicService.getRecentlyPlayedMusic();
        if (idTrack === null) {
          dispatch(setErrorEmptyMusic(true));
          dispatch(setUserCurrentMusic(null));
          return;
        }
      } else {
        idTrack = resp;
      }
      const music = await MusicServiceProvider.musicService.getMusicById(idTrack);
      dispatch(setUserCurrentMusic(music))
    } catch (error: any) {
      switch (error.response.status) {
        case 401:
          dispatch(logout);
          break;
        case 403:
          dispatch(setAccessError(true));
          break;
        default:
          console.error("Error retrieving music currently listened : " + error);
          dispatch(setAccessError(true));
          break;
      }
    }
  }
}

export const getFavoriteMusic = () => {
  //@ts-ignore
  return async dispatch => {
    try {
      let token: string | null = await SecureStore.getItemAsync(configs.key);
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      const resp = await axios.get(
        configs.API_URL + '/user/musics',
        { headers }
      )

      const musicIds = resp.data.musics.map((music: any) => music.musicId);
      const musics = await MusicServiceProvider.musicService.getMusicsWithIds(musicIds);
      const result = resp.data.musics
        .filter((music: any) => musics.some((m: any) => m.id === music.musicId))
        .map((music: any) => {
          const matchingMusic = musics.find((m: any) => m.id === music.musicId);
          return {
            ...music,
            music: matchingMusic,
          };
        });

      dispatch(setFavoriteMusic(result.map((item: any) => SpotMapper.toModel(item))));

    } catch (error: any) {
      console.error(error);
      dispatch(setAccessError(true));
    }
  };
}

export const addMusicToFavorite = (spot: Spot) => {
  //@ts-ignore
  return async dispatch => {
    try {
      dispatch(removeFromSpotList(spot));
      let token: string | null = await SecureStore.getItemAsync(configs.key);
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      const body = {
        "musicId": spot.music.id,
        "userId": spot.user
      }
      await axios.post(configs.API_URL + '/user/musics', body, { headers });

      spot.date = new Date(Date.now());
      dispatch(addFavoriteMusic(spot));
    } catch (error: any) {
      switch (error.response.status) {
        default:
          console.error("Error like spot : " + error);
          break;
      }
    }
  };
}