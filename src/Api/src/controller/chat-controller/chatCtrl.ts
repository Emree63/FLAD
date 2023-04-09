import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import Controller from '../Icontroller';
import HttpException from '../../middleware/exeption/httpExeption';
// import LocationService from '../../service/LocationService';
import IUser from '../../database/schema/User/UserInterface';
import UserService from '../../service/UserService';
import validator from '../../database/schema/User/UserValidation'
import validationMiddleware from '../../middleware/validation/ValidatorMiddleware';
import authenticator from '../../middleware/authMiddleware'
import LocationService from '../../service/LocationService';
class ChatController implements Controller {
    public path = '/chat';
    public router = Router();
    private chatService = new ChatService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
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

    }

   
    
    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            // the FladId should be created by the Userservice
            const { name, email, password , idFlad, idSpotify } = req.body;
            console.log(name, email, password, idFlad, idSpotify);
            
            const token = await this.userService.register(
                name,
                email,
                password,
                idFlad,
                idSpotify
            );

            res.status(201).json({ token });
        } catch (error : any) {
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
        } catch (error : any) {
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

   
   

}

export default ChatController;


