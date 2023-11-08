import { IMusic } from "../models/Music";
import LocationSchema from "../database/LocationSchema";
import UserSchema from "../database/UserSchema";
import token from "./TokenService";

class UserService {
    private user = UserSchema;
    private location = LocationSchema;

    public async register(
        name: string,
        email: string,
        password: string,
        idSpotify: string,
        tokenSpotify: string,
        image: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                password,
                tokenSpotify,
                idSpotify,
                image
            });
            return token.createToken(user);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        const user = await this.user.findOne({ email });
        if (!user) {
            throw new Error('Wrong credentials given');
        }
        if (await user.isValidPassword(password)) {
            return token.createToken(user);
        } else {
            throw new Error('Wrong credentials given');
        }
    }

    public async delete(
        id: string
    ): Promise<void | Error> {
        try {
            await this.user.findByIdAndRemove(id);
            await this.location.findByIdAndRemove(id);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async addMusic(userId: string, music: IMusic): Promise<string | Error> {
        try {
            return await this.user.findByIdAndUpdate(userId, {
                $push: { musics_likes: music },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deleteMusic(userId: string, musicId: string): Promise<boolean | Error> {
        try {
            const userOld = await this.user.findById(userId);
            const userNew = await this.user.findByIdAndUpdate(userId, {
                $pull: { musics_likes: { _id: musicId } },
            }, { new: true });

            if (userOld.musics_likes.length === userNew.musics_likes.length) {
                return false;
            }
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async getMusics(userId: string): Promise<IMusic[] | Error> {
        try {
            const user = await this.user.findById(userId);
            return user?.musics_likes || [];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async setName(userId: string, newName: string): Promise<void | Error> {
        try {
            await this.user.findByIdAndUpdate(
                userId,
                { name: newName },
                { new: true }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async setEmail(userId: string, newEmail: string): Promise<void | Error> {
        try {
            await this.user.findByIdAndUpdate(
                userId,
                { email: newEmail },
                { new: true }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default UserService;