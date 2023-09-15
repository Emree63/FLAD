import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import IToken from '../database/IToken';
import UserSchema from '../database/UserSchema';
import token from '../models/Token';
import HttpException from '../exception/HttpException';

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    const accessToken = bearer.split('Bearer')[1].trim();
    try {
        const payload: IToken | jwt.JsonWebTokenError = await token.verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        const user = await UserSchema.findById(payload.id)
            .select('-password')
            .exec();

        if (!user) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        req.user = user;

        return next();
    } catch (error) {
        return next(new HttpException(401, 'Unauthorised'));
    }
}

export default authenticatedMiddleware;