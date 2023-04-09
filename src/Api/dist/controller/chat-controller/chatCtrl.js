"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const httpExeption_1 = __importDefault(require("../../middleware/exeption/httpExeption"));
const UserService_1 = __importDefault(require("../../service/UserService"));
const UserValidation_1 = __importDefault(require("../../database/schema/User/UserValidation"));
const ValidatorMiddleware_1 = __importDefault(require("../../middleware/validation/ValidatorMiddleware"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const LocationService_1 = __importDefault(require("../../service/LocationService"));
class UserController {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.userService = new UserService_1.default();
        this.locationService = new LocationService_1.default();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // the FladId should be created by the Userservice
                const { name, email, password, idFlad, idSpotify } = req.body;
                console.log(name, email, password, idFlad, idSpotify);
                const token = yield this.userService.register(name, email, password, idFlad, idSpotify);
                res.status(201).json({ token });
            }
            catch (error) {
                next(new httpExeption_1.default(400, error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = yield this.userService.login(email, password);
                res.status(200).json({ token });
            }
            catch (error) {
                next(new httpExeption_1.default(400, error.message));
            }
        });
        this.getUser = (req, res, next) => {
            if (!req.user) {
                return next(new httpExeption_1.default(404, 'No logged in user'));
            }
            res.status(200).send({ data: req.user });
        };
        this.getUserNext = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const longitude = Number(req.params.longitude);
                const latitude = Number(req.params.latitude);
                //verify::val_int(){
                console.log('woooooooooooooo' + req);
                if (isNaN(longitude) || isNaN(latitude)) {
                    console.log('Impossible de convertir la chaîne en nombre');
                }
                //}
                const userId = req.user.idFlad;
                const musicId = req.params.currentMusic;
                const data = yield this.locationService.getNearUser(userId, musicId, latitude, longitude);
                console.log(data);
                res.status(201).send(data);
            }
            catch (error) {
                next(new httpExeption_1.default(400, 'Cannot create get netUser'));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/register`, (0, ValidatorMiddleware_1.default)(UserValidation_1.default.register), this.register);
        this.router.post(`${this.path}/login`, (0, ValidatorMiddleware_1.default)(UserValidation_1.default.login), this.login);
        this.router.get(`${this.path}`, authMiddleware_1.default, this.getUser);
    }
}
exports.default = ChatController;
//# sourceMappingURL=chatCtrl.js.map