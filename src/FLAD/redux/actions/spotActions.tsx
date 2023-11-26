import { Spot } from "../../models/Spot";
import { spotTypes } from "../types/spotTypes";
import { userTypes } from "../types/userTypes";

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