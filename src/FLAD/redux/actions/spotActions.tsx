import Music from "../../models/Music";
import { Spot } from "../../models/Spot";
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