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
    ): Promise<string | Error> {
        try {
            await this.user.findByIdAndRemove(id);
            await this.location.findByIdAndRemove(id);
            return;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default UserService;