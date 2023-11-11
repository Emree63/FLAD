import { Router, Request, Response, NextFunction } from 'express';
import IController from './interfaces/IController';
import HttpException from '../exception/HttpException';
import User from '../models/User';
import UserService from '../services/UserService';
import validator from '../middlewares/UserValidation'
import validationMiddleware from '../middlewares/validationMiddleware';
import authenticator from '../middlewares/authMiddleware'
import LocationService from '../services/LocationService';
import axios from 'axios';
import { IMusic } from '../models/Music';
import * as fs from 'fs';
import * as base64js from 'base64-js';

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
        this.router.delete(`${this.path}/musics/:id`, authenticator, this.deleteMusic);
        this.router.post(`${this.path}/musics`, authenticator, this.addMusic);
        this.router.get(`${this.path}/musics`, authenticator, this.getMusics);
        this.router.put(`${this.path}/name`, authenticator, this.setName);
        this.router.put(`${this.path}/email`, authenticator, this.setEmail);
        this.router.put(`${this.path}/image`, authenticator, this.setImage);
        this.router.put(`${this.path}/password`, authenticator, this.setPassword);

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
            const authOptions = {
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
                        const imagePath = './src/assets/images/default_user.png';
                        const imageBuffer = fs.readFileSync(imagePath);
                        const base64Image = 'data:image/png;base64,' + base64js.fromByteArray(imageBuffer);
                        image = base64Image
                    }
                }
            }
        } catch (error: any) {
            console.log(error);
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

    private deleteMusic = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const musicId: string = req.params.id;
            if (!musicId) {
                return res.status(400).json({ error: 'musicId are required fields.' });
            }

            const deleted = await this.userService.deleteMusic(_id, musicId);

            if (deleted) {
                res.status(200).send({ message: 'Music deleted successfully.' });
            } else {
                res.status(404).json({ error: 'Music not found.' });
            }

        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
    }

    private addMusic = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const { idMusic, idUser } = req.body;
            if (!idMusic || !idUser) {
                return res.status(400).json({ error: 'idMusic and idUser are required fields.' });
            }
            const music: IMusic = {
                idMusic,
                idUser,
                date: new Date(),
            };
            await this.userService.addMusic(_id, music);
            res.status(201).send({ music });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private getMusics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const userId: string = req.user.id;
            const musics = await this.userService.getMusics(userId);
            return res.status(200).json({ musics });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private setName = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const { name } = req.body;

            const regex = /^\w+$/;
            if (!regex.test(name) || !name) {
                return res.status(400).json({ error: "Name should only contain alphanumeric characters (letters, numbers, and underscores)" });
            }

            await this.userService.setName(_id, name.toLowerCase());

            res.status(200).json({ message: 'Name updated successfully' });
        } catch (error: any) {
            next(new HttpException(409, error.message));
        }
    }

    private setEmail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const { email } = req.body;

            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(email) || !email) {
                return res.status(400).json({ error: "Invalid email" });
            }

            await this.userService.setEmail(_id, email.toLowerCase());

            res.status(200).json({ message: 'Email updated successfully' });
        } catch (error: any) {
            next(new HttpException(409, error.message));
        }
    }

    private setImage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const { image } = req.body;

            await this.userService.setImage(_id, image);

            res.status(200).json({ message: 'Image updated successfully' });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    }

    private setPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const { oldPassword, newPassword } = req.body;

            await this.userService.setPassword(_id, oldPassword, newPassword);

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error: any) {
            next(new HttpException(500, error.message));
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
