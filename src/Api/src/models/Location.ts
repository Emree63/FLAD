import { Document } from 'mongoose';

export class UserLocation {
    _id: string;
    userId: string;
    musicId: string;
    distance: number;
    date: Date;
    constructor(id: string, userId: string, musicId: string, distance: number, date: Date) {
        this._id = id;
        this.userId = userId;
        this.musicId = musicId;
        this.distance = distance;
        this.date = date;
    }
}

export class Location extends Document {
    userId: string;
    musicId: string;
    latitude: number;
    longitude: number;
    updatedAt: Date;
}