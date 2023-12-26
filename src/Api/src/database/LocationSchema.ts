import { Schema, model } from 'mongoose';
import { Location } from '../models/Location';

const locationSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    musicId: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    }
},
    { timestamps: true }
);

export default model<Location>('Location', locationSchema);