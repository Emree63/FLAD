import { Router, Request, Response } from 'express';
import IController from './interfaces/IController';
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
        /**
         * @swagger
         * /api/auth/register:
         *   post:
         *     summary: Register a new user
         *     description: Register a new user with the provided details
         *     tags:
         *       - Authentication
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *              type: object
         *              properties:
         *                 email:
         *                   type: string
         *                   default: john.doe@example.com
         *                 password:
         *                   type: string
         *                   default: stringPassword123
         *                 name:
         *                   type: string
         *                   default: john_doe
         *                 tokenSpotify:
         *                   type: string
         *     responses:
         *       201:
         *         description: User registered successfully
         *       400:
         *         description: Bad request - Invalid input data
         *       401:
         *         description: Unauthorized - Spotify token is invalid
         *       409:
         *         description: Conflict - Email or username is already in use
         *       500:
         *         description: Internal Server Error - Spotify account not authorized or not found
         */
        this.router.post(
            `${this.authPath}/register`,
            validationMiddleware(validator.register),
            this.register
        );

        /**
         * @swagger
         * /api/auth/login:
         *   post:
         *     summary: Login a user
         *     description: Login with the provided email and password
         *     tags:
         *       - Authentication
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *              type: object
         *              properties:
         *                 email:
         *                   type: string
         *                   default: john.doe@example.com
         *                 password:
         *                   type: string
         *                   default: stringPassword123
         *     responses:
         *       200:
         *         description: User logged in successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 token:
         *                   type: string
         *       400:
         *         description: Bad request - Invalid input data
         */
        this.router.post(
            `${this.authPath}/login`,
            validationMiddleware(validator.login),
            this.login
        );

        /**
         * @swagger
         * /api/user:
         *   get:
         *     summary: Get user information
         *     description: Get information about the authenticated user
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: User logged in successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         */
        this.router.get(`${this.path}`, authenticator, this.getUser);


        /**
         * @swagger
         * /api/users:
         *   get:
         *     summary: Get information about multiple users
         *     description: Get information about multiple users based on provided user ids
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: query
         *         name: ids
         *         schema:
         *           type: string
         *         description: Comma-separated list of user ids
         *     responses:
         *       200:
         *         description: Users information retrieved successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         */
        this.router.get(`${this.path}s`, authenticator, this.getUsers);

        /**
         * @swagger
         * /api/user:
         *   delete:
         *     summary: Delete the authenticated user
         *     description: Delete the authenticated user and associated data
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       204:
         *         description: User deleted successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       404:
         *         description: User not found
         */
        this.router.delete(`${this.path}`, authenticator, this.deleteUser);

        /**
         * @swagger
         * /api/user/nextTo:
         *   get:
         *     summary: Get users near the authenticated user
         *     description: Get information about users near the authenticated user based on location
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: query
         *         name: longitude
         *         schema:
         *           type: number
         *         description: Longitude of the user's current location
         *       - in: query
         *         name: latitude
         *         schema:
         *           type: number
         *         description: Latitude of the user's current location
         *       - in: query
         *         name: currentMusic
         *         schema:
         *           type: string
         *         description: The ID of the currently playing music
         *     responses:
         *       201:
         *         description: Users near the authenticated user retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 data:
         *                   type: array
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       400:
         *         description: Bad request - Invalid input data
         */
        this.router.get(`${this.path}/nextTo`, authenticator, this.getUserNext);

        /**
         * @swagger
         * /api/user/musics/{id}:
         *   delete:
         *     summary: Delete a music from the authenticated user's liked list
         *     description: Delete a music from the authenticated user's liked list by music id
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         description: The ID of the music to delete
         *     responses:
         *       200:
         *         description: Music deleted successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       404:
         *         description: Music not found
         */
        this.router.delete(`${this.path}/musics/:id`, authenticator, this.deleteMusic);

        /**
         * @swagger
         * /api/user/musics:
         *   post:
         *     summary: Add a music to the authenticated user's liked list
         *     description: Add a music to the authenticated user's liked list
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               musicId:
         *                 type: string
         *                 description: The ID of the music to add
         *               userId:
         *                 type: string
         *                 description: The ID of the user who liked the music
         *     responses:
         *       201:
         *         description: Music added to liked list successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       400:
         *         description: Bad request - Invalid input data
         */
        this.router.post(`${this.path}/musics`, authenticator, this.addMusic);

        /**
         * @swagger
         * /api/user/musics:
         *   get:
         *     summary: Get the list of musics liked by the authenticated user
         *     description: Get the list of musics liked by the authenticated user
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: List of musics retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 musics:
         *                   type: array
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         */
        this.router.get(`${this.path}/musics`, authenticator, this.getMusics);

        /**
         * @swagger
         * /api/user/name:
         *   put:
         *     summary: Update the name of the authenticated user
         *     description: Update the name of the authenticated user
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 description: The new name for the user
         *     responses:
         *       200:
         *         description: User name updated successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       400:
         *         description: Bad request - Invalid input data
         *       409:
         *         description: Conflict - The provided name is already in use by another user
         */
        this.router.put(`${this.path}/name`, authenticator, this.setName);

        /**
         * @swagger
         * /api/user/email:
         *   put:
         *     summary: Update the email of the authenticated user
         *     description: Update the email of the authenticated user
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 description: The new email for the user
         *     responses:
         *       200:
         *         description: User email updated successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       400:
         *         description: Bad request - Invalid input data
         *       409:
         *         description: Conflict - The provided email is already in use by another user
         */
        this.router.put(`${this.path}/email`, authenticator, this.setEmail);

        /**
         * @swagger
         * /api/user/spotify:
         *   put:
         *     summary: Update the spotify account
         *     description: Update the spotify account of the authenticated user
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               tokenSpotify:
         *                 type: string
         *                 description: Spotify token
         *     responses:
         *       200:
         *         description: Spotify account updated successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       409:
         *         description: Conflict - The provided token is already in use by another user
         *       500:
         *         description: Internal Server Error - Spotify account not authorized or not found
         */
        this.router.put(`${this.path}/spotify`, authenticator, this.setSpotify);

        /**
         * @swagger
         * /api/user/image:
         *   put:
         *     summary: Update the profile image of the authenticated user
         *     description: Update the profile image of the authenticated user
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               image:
         *                 type: string
         *                 format: base64
         *                 description: The new profile image for the user (base64 encoded)
         *     responses:
         *       200:
         *         description: User profile image updated successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       500:
         *         description: Internal Server Error - Unable to update the profile image
         */
        this.router.put(`${this.path}/image`, authenticator, this.setImage);

        /**
         * @swagger
         * /api/user/password:
         *   put:
         *     summary: Update the password of the authenticated user
         *     description: Update the password of the authenticated user
         *     tags:
         *       - User
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               oldPassword:
         *                 type: string
         *                 description: The current password of the user
         *               newPassword:
         *                 type: string
         *                 description: The new password for the user
         *     responses:
         *       200:
         *         description: User password updated successfully
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       500:
         *         description: Internal Server Error - Unable to update the password
         */
        this.router.put(`${this.path}/password`, authenticator, this.setPassword);
    }

    private register = async (
        req: Request,
        res: Response
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
            res.status(409).json(error.message);
        }
    };

    private login = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.login(email, password);
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(400).json(error.message)
        }
    };

    private getUser = (
        req: Request,
        res: Response
    ): Response | void => {
        res.status(200).send({ data: req.user });
    };

    private getUsers = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const userIds = req.query.ids as string;

        if (!userIds) {
            return res.status(200).json([]);
        }

        const userIdArray = userIds.split('&');

        try {
            const users = await this.userService.getUsers(userIdArray);
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    private deleteUser = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            await this.userService.delete(_id);
            await this.locationService.delete(_id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json(error.message)
        }
    };

    private getUserNext = async (
        req: Request,
        res: Response
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
            res.status(400).json(error.message)
        }
    }

    private deleteMusic = async (
        req: Request,
        res: Response
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
            res.status(404).json(error.message)
        }
    }

    private addMusic = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const { musicId, userId } = req.body;
            if (!musicId || !userId) {
                return res.status(400).json({ error: 'musicId and userId are required fields.' });
            }
            const music: IMusic = {
                musicId,
                userId,
                date: new Date(),
            };
            await this.userService.addMusic(_id, music);
            res.status(201).send({ music });
        } catch (error: any) {
            res.status(400).json(error.message)
        }
    }

    private getMusics = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        try {
            const userId: string = req.user.id;
            const musics = await this.userService.getMusics(userId);
            return res.status(200).json({ musics });
        } catch (error: any) {
            res.status(400).json(error.message)
        }
    }

    private setName = async (
        req: Request,
        res: Response
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
            res.status(409).json(error.message)
        }
    }

    private setEmail = async (
        req: Request,
        res: Response
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
            res.status(409).json(error.message)
        }
    }

    private setSpotify = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        let access_token;
        let idAccount: string;
        let image: string;
        const { _id, idSpotify } = req.user;
        const { tokenSpotify } = req.body;

        if (!tokenSpotify) {
            return res.status(400).json({ error: 'TokenSpotify is missing in the request.' });
        }

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
                    idAccount = resp.data.id;
                    if (idSpotify === idAccount) {
                        return res.status(400).json({ error: 'idSpotify cannot be the same as idAccount.' });
                    }
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
            res.status(500).send("Internal Server Error: Unable to authenticate with Spotify");
            return;
        }
        try {
            await this.userService.setSpotify(_id, tokenSpotify, idAccount, image);

            res.status(200).json({ message: 'Spotify token updated successfully' });
        } catch (error: any) {
            res.status(409).json(error.message)
        }
    }

    private setImage = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const { image } = req.body;

            await this.userService.setImage(_id, image);

            res.status(200).json({ message: 'Image updated successfully' });
        } catch (error: any) {
            res.status(500).json(error.message)
        }
    }

    private setPassword = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        try {
            const { _id } = req.user;
            const { oldPassword, newPassword } = req.body;

            await this.userService.setPassword(_id, oldPassword, newPassword);

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error: any) {
            res.status(500).json(error.message)
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
