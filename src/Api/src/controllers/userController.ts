import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import IController from './interfaces/IController';
import HttpException from '../exception/HttpException';
import User from '../models/User';
import UserService from '../services/UserService';
import validator from '../middlewares/UserValidation'
import validationMiddleware from '../middlewares/validationMiddleware';
import authenticator from '../middlewares/authMiddleware'
import LocationService from '../services/LocationService';
import axios, { AxiosError } from 'axios';

class UserController implements IController {
    public path = '/user';
    public authPath = '/auth';
    public router = Router();
    private userService = new UserService();
    private locationService = new LocationService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post(
            `${this.authPath}/register`,
            validationMiddleware(validator.register),
            this.register
        );
        this.router.post(
            `${this.authPath}/login`,
            validationMiddleware(validator.login),
            this.login
        );
        this.router.get(`${this.path}`, authenticator, this.getUser);
        this.router.delete(`${this.path}`, authenticator, this.deleteUser);
        this.router.get(`${this.path}/nextTo`, authenticator, this.getUserNext);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        let access_token;
        let idSpotify: string;
        let image: string;
        const { name, email, password, tokenSpotify } = req.body;
        const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080/api';
        const refreshUrl = `${apiBaseUrl}/spotify/refresh?refresh_token=${tokenSpotify}`;
        try {
            var authOptions = {
                method: 'GET',
                url: refreshUrl,
                json: true
            };
            const authResponse = await axios(authOptions);
            if (authResponse.status === 200) {
                access_token = authResponse.data.access_token;
                const headers = {
                    Authorization: `Bearer ${access_token}`,
                };
                const resp = await axios.get('https://api.spotify.com/v1/me', { headers });
                if (resp.status == 200) {
                    const images = resp.data.images;
                    idSpotify = resp.data.id;
                    if (images && images.length > 0) {
                        images.sort((a: any, b: any) => b.height - a.height);
                        image = images[0].url;
                    }
                    else {
                        image = "data:image/png;base64,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"
                    }
                }
            }
        } catch (error: any) {
            if (error.response.status === 400) {
                res.status(401).send("Unauthorized: Spotify token is invalid");
                return;
            }
            res.status(500).send("Internal Server Error: Unable to authenticate with Spotify");
            return;
        }

        try {
            const token = await this.userService.register(
                name.toLowerCase(),
                email.toLowerCase(),
                password,
                idSpotify,
                tokenSpotify,
                image
            );
            res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(409, error.message));
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
        res.status(200).send({ data: req.user });
    };

    private deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            await this.userService.delete(_id);
            res.status(204).send();
        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
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
