import { Spot } from "../Spot";

export class SpotMapper {
    public static toModel(spot: any): Spot {
        return new Spot(spot.idUser, spot.music, new Date(spot.date));
    }
}