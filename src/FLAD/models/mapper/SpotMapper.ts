import { Spot } from "../Spot";

export class SpotMapper {
    public static toModel(spot: any): Spot {
        return new Spot(spot._id, spot.user, spot.music, spot.distance, new Date(spot.date));
    }
}