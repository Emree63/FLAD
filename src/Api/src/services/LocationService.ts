import { UserLocation } from '../models/Location';
import LocationSchema from "../database/LocationSchema";

class LocationService {
    private locations = LocationSchema;
    public async getNearUser(userId: string, musicId: string, latitude: number, longitude: number) {
        await this.locations.findOneAndUpdate(
            { userId },
            { userId, musicId, latitude, longitude },
            { upsert: true }
        );

        const snapshot = await this.locations.find({ userId: { $ne: userId } });
        if (!snapshot.length) {
            console.log('No matching documents.');
            return;
        }

        let usersLocation: UserLocation[] = [];
        snapshot.forEach(doc => {
            usersLocation.push(new UserLocation(doc.userId, doc.musicId, doc.latitude, doc.longitude));
        });
        const listUser: Record<string, string> = {};
        usersLocation.forEach(user => {
            const distance = this.distanceBetween(latitude, longitude, user.latitude, user.longitude);
            if (distance <= 100) {
                listUser[user.userId] = user.musicId;
            }
        });
        return { listUser };
    }

    private distanceBetween(lat1: number, lon1: number, lat2: number, lon2: number): number {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

            if (dist > 1) {
                dist = 1;
            }

            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;

            return dist;
        }
    }
}

export default LocationService;