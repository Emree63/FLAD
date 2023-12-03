import axios from "axios";
import configs from "../../constants/config";
import * as SecureStore from 'expo-secure-store';
import qs from "qs";
import { removeFromSpotList, setSpotList } from "../actions/spotActions";
import { MusicServiceProvider } from "../../models/MusicServiceProvider";
import { SpotMapper } from "../../models/mapper/SpotMapper";
import { Spot } from "../../models/Spot";
import { Person } from "../../models/Person";
import Music from "../../models/Music";
import { PersonMapper } from "../../models/mapper/PersonMapper";

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

      const userIds = resp.data.data.map((user: any) => user.userId);

      const users = await getUsersInfo(userIds);

      const result = resp.data.data
        .filter((spot: any) => musics.some((m: Music) => m.id === spot.musicId))
        .filter((spot: any) => users.some((u: Person) => u.id === spot.userId))
        .map((spot: any) => {
          const matchingMusic = musics.find((m: any) => m.id === spot.musicId);
          const matchingUser = users.find((user: any) => user.id === spot.userId);
          return {
            ...spot,
            music: matchingMusic,
            user: matchingUser,
          };
        });
      dispatch(setSpotList(result.map((item: any) => SpotMapper.toModel(item))));

    } catch (error: any) {
      console.log(error);
      switch (error.response.status) {
        default:
          console.error("Error retrieving spots : " + error);
          break;
      }
    }

  }
}

const getUsersInfo = async (userIds: string[]) => {
  try {
    const token: string | null = await SecureStore.getItemAsync(configs.key);

    const ids = userIds.join('&');

    const resp = await axios({
      url: configs.API_URL + `/users?ids=${ids}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return resp.data.map((item: any) => PersonMapper.toModel(item));
  } catch (error) {
    console.error("Error retrieving user information: " + error);
    return [];
  }
}

export const removeSpot = (spot: Spot) => {
  //@ts-ignore
  return async dispatch => {
    dispatch(removeFromSpotList(spot));
  }
}

export const addToPlaylist = (spot: Spot) => {
  //@ts-ignore
  return async dispatch => {
    MusicServiceProvider.musicService.addToPlaylist(spot.music.id);
    dispatch(removeFromSpotList(spot));
  }
}