import Music from "../../model/Music";
import { Spot } from "../../model/Spot";
import { spotifyTypes } from "../types/spotifyTypes";
import { spotTypes } from "../types/spotTypes";

export const setSpotList = (spotList: Spot[]) => {
  return {
    type: spotTypes.FETCH_SPOT,
    payload: spotList,
  };
}
export const removeFromSpotList = (spot: Spot) => {
  return {
      type: spotTypes.REMOVE_SPOT,
      payload: spot
  }
}

export const addSpotListMock = (spotList: Spot[]) => {
  return {
    type: spotTypes.ADD_SPOT_MOCK,
    payload: spotList,
  };
}

export const setUserCurrentMusic = (currentMusic: Music) => {
  return {
    type: spotifyTypes.GET_USER_CURRENT_MUSIC,
    payload: currentMusic,
  };
}