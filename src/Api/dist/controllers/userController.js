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
const HttpException_1 = __importDefault(require("../exception/HttpException"));
const UserService_1 = __importDefault(require("../services/UserService"));
const UserValidation_1 = __importDefault(require("../middlewares/UserValidation"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const LocationService_1 = __importDefault(require("../services/LocationService"));
class UserController {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.userService = new UserService_1.default();
        this.locationService = new LocationService_1.default();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, idSpotify } = req.body;
                const token = yield this.userService.register(name, email, password, idSpotify);
                res.status(201).json({ token });
            }
            catch (error) {
                next(new HttpException_1.default(400, error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = yield this.userService.login(email, password);
                res.status(200).json({ token });
            }
            catch (error) {
                next(new HttpException_1.default(400, error.message));
            }
        });
        this.getUser = (req, res, next) => {
            if (!req.user) {
                return next(new HttpException_1.default(404, 'No logged in user'));
            }
            res.status(200).send({ data: req.user });
        };
        this.getUserNext = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const longitude = Number(req.query.longitude);
                const latitude = Number(req.query.latitude);
                if (isNaN(longitude) || isNaN(latitude)) {
                    console.log('Unable to convert string to number');
                    throw new Error('Unable to convert string to number');
                }
                const userId = req.user.id;
                const musicId = String(req.query.currentMusic);
                const data = yield this.locationService.getNearUser(userId, musicId, latitude, longitude);
                res.status(201).send(data);
            }
            catch (error) {
                next(new HttpException_1.default(400, 'Cannot create get netUser: ' + error.message));
            }
        });
        this.initRoutes();
    }
    initRoutes() {
        this.router.post(`${this.path}/register`, (0, validationMiddleware_1.default)(UserValidation_1.default.register), this.register);
        this.router.post(`${this.path}/login`, (0, validationMiddleware_1.default)(UserValidation_1.default.login), this.login);
        this.router.get(`${this.path}`, authMiddleware_1.default, this.getUser);
        this.router.get(`${this.path}/nextTo`, authMiddleware_1.default, this.getUserNext);
    }
}
exports.default = UserController;
//# sourceMappingURL=userController.js.map