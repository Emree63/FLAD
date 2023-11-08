import User from "../models/User";
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    idSpotify: {
        type: String,
        required: true,
        unique: true
    },
    tokenSpotify: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
    ,
    image: {
        type: String,
        required: true
    },
    musics_likes: {
        type: [{
            idMusic: String,
            idUser: String,
            date: Date
        }],
        default: [] 
    }
},
    { timestamps: true }
);

userSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
    next();
});

userSchema.methods.isValidPassword = async function (
    password: string
): Promise<boolean | Error> {
    return await bcrypt.compare(password, this.password);
};

export default model<User>('User', userSchema);