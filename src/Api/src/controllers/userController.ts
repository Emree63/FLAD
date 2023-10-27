import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import IController from './interfaces/IController';
import HttpException from '../exception/HttpException';
import User from '../models/User';
import UserService from '../services/UserService';
import validator from '../middlewares/UserValidation'
import validationMiddleware from '../middlewares/validationMiddleware';
import authenticator from '../middlewares/authMiddleware'
import LocationService from '../services/LocationService';

class UserController implements IController {
    public path = '/users';
    public router = Router();
    private userService = new UserService();
    private locationService = new LocationService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validator.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validator.login),
            this.login
        );
        this.router.get(`${this.path}`, authenticator, this.getUser);
        this.router.get(`${this.path}/nextTo`, authenticator, this.getUserNext);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password, idSpotify } = req.body;
            const token = await this.userService.register(
                name.toLowerCase(),
                email.toLowerCase(),
                password,
                idSpotify
            );
            res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.login(email, password);
            res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }
        res.status(200).send({ data: req.user });
    };

    private getUserNext = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const longitude = Number(req.query.longitude);
            const latitude = Number(req.query.latitude);
            if (isNaN(longitude) || isNaN(latitude)) {
                console.log('Unable to convert string to number');
                throw new Error('Unable to convert string to number');
            }
            const userId = req.user.id;
            const musicId = String(req.query.currentMusic);
            const data = await this.locationService.getNearUser(userId, musicId, latitude, longitude);
            res.status(201).send(data);
        }
        catch (error: any) {
            next(new HttpException(400, 'Cannot create get netUser: ' + error.message));
        }
    }
}

export default UserController;

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}
