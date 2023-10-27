import { User } from "../User";

export class UserMapper {

    public static toModel(user: any): User {
        return new User(user.idFlad, user.idSpotify, user.email, user.createdAt, user.name, user.imageUrl);
    }
}