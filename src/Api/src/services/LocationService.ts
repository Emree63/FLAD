import { UserLocation } from '../models/Location';
import LocationSchema from "../database/LocationSchema";

class LocationService {
    private location = LocationSchema;
    public async getNearUser(userId: string, musicId: string, latitude: number, longitude: number) {
        await this.location.findOneAndUpdate(
            { userId },
            { userId, musicId, latitude, longitude },
            { upsert: true }
        );

        const snapshot = await this.location.find({ userId: { $ne: userId } });
        if (!snapshot.length) {
            console.log('No matching documents.');
            return;
        }

        let usersLocation: UserLocation[] = [];

        snapshot.forEach(location => {
            const distance = this.distanceBetween(latitude, longitude, location.latitude, location.longitude);
            if (distance <= 1000) {
                usersLocation.push(new UserLocation(location._id, location.userId, location.musicId, Math.ceil(distance + 0.1 / 200) * 200, location.updatedAt));
            }
        });
        return { data: usersLocation };
    }

    private distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            const radlat1 = Math.PI * lat1 / 180;
            const radlat2 = Math.PI * lat2 / 180;
            const theta = lon1 - lon2;
            const radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

            if (dist > 1) {
                dist = 1;
            }

            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344 * 1000;

            return dist;
        }
    }

    public async delete(
        id: string
    ): Promise<void | Error> {
        try {
            await this.location.findByIdAndRemove(id);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default LocationService;