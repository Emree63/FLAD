import jwt from 'jsonwebtoken';
import User from '../models/User';
import Token from '../models/Token';

export const createToken = (user: User): string => {
    return jwt.sign({ id: user._id }, process.env.SECRET_JWT as jwt.Secret, {
        expiresIn: '15d',
    });
};

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.SECRET_JWT as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err);
                resolve(payload as Token);
            }
        );
    });
};

export default { createToken, verifyToken };