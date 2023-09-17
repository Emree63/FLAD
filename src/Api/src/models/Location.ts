import { Document } from 'mongoose';

export class UserLocation {
    userId: string;
    musicId : string;
    latitude : number;
    longitude: number;
    constructor(userId: string, musicId : string,latitude: number, longitude: number){
        this.userId = userId;
        this.musicId = musicId;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

export class Location extends Document {
    userId: string;
    musicId: string;
    latitude: number;
    longitude: number;
}