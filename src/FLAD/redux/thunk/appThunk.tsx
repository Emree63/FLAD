import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { Spot } from "../../models/Spot";
import configs from "../../constants/config";
import { MusicServiceProvider } from "../../models/MusicServiceProvider";
import { setFavoriteMusic, setUserCurrentMusic } from "../actions/appActions";
import { setAccessError, setErrorEmptyMusic } from "../actions/userActions";
import { SpotMapper } from "../../models/mapper/SpotMapper";

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
      console.error("Error retrieving music currently listened : " + error);
      switch (error.response.status) {
        case 403:
          dispatch(setAccessError(true));
          break;
        default:
          dispatch(setAccessError(true));
          break;
      }
    }
  }
}

export const addFavoriteMusic = (spot: Spot) => {
  //@ts-ignore
  return async dispatch => {

  };
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

      const musicIds = resp.data.musics.map((music: any) => music.idMusic);
      const musics = await MusicServiceProvider.musicService.getMusicsWithIds(musicIds);
      const result = resp.data.musics
        .filter((music: any) => musics.some((m: any) => m.id === music.idMusic))
        .map((music: any) => {
          const matchingMusic = musics.find((m: any) => m.id === music.idMusic);
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