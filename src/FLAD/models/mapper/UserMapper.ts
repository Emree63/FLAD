import { User } from "../User";

export class UserMapper {
    public static toModel(user: any): User {
        return new User(user._id, user.idSpotify, user.name, user.email, new Date(user.createdAt), user.image);
    }
}