import jwt from 'jsonwebtoken';
import IUser from './User';
import IToken from '../database/IToken';

export const createToken = (user: IUser): string => {
    return jwt.sign({ id: user._id }, "foo" as jwt.Secret, {
        expiresIn: '100d',
    });
};

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | IToken> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            "foo" as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err);

                resolve(payload as IToken);
            }
        );
    });
};

export default { createToken, verifyToken };