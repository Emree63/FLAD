import { Document } from 'mongoose';
import { IMusic } from './Music';

export default interface User extends Document {
    idSpotify: string;
    tokenSpotify: string;
    name: string;
    email: string;
    password: string;
    isValidPassword(password: string): Promise<Error | boolean>;
    image: string;
    musics_likes: IMusic[];
}