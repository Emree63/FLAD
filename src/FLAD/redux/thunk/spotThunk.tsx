import axios from "axios";
import configs from "../../constants/config";
import * as SecureStore from 'expo-secure-store';
import qs from "qs";
import { setSpotList } from "../actions/spotActions";
import { MusicServiceProvider } from "../../models/MusicServiceProvider";
import { SpotMapper } from "../../models/mapper/SpotMapper";

export const getSpotList = (longitude: string, latitude: string, music: string) => {
  //@ts-ignore
  return async dispatch => {
    try {
      let token: string | null = await SecureStore.getItemAsync(configs.key);
      const body: Record<string, string | boolean | number | (string | boolean | number)[]> = {
        longitude: longitude,
        latitude: latitude,
        currentMusic: music
      }
      const resp = await axios({
        url: configs.API_URL + '/user/nextTo?' + qs.stringify(body),
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const musicIds = resp.data.data.map((music: any) => music.musicId);
      const musics = await MusicServiceProvider.musicService.getMusicsWithIds(musicIds);
      const result = resp.data.data
        .filter((spot: any) => musics.some((m: any) => m.id === spot.musicId))
        .map((spot: any) => {
          const matchingMusic = musics.find((m: any) => m.id === spot.musicId);
          return {
            ...spot,
            music: matchingMusic,
          };
        });
      dispatch(setSpotList(result.map((item: any) => SpotMapper.toModel(item))));

    } catch (error: any) {
      switch (error.response.status) {
        default:
          console.error("Error retrieving spots : " + error);
          break;
      }
    }

  }
}