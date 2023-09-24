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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema_1 = __importDefault(require("../database/UserSchema"));
const TokenService_1 = __importDefault(require("../services/TokenService"));
const HttpException_1 = __importDefault(require("../exception/HttpException"));
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bearer = req.headers.authorization;
        if (!bearer || !bearer.startsWith('Bearer ')) {
            return next(new HttpException_1.default(401, 'Unauthorized'));
        }
        const accessToken = bearer.split('Bearer')[1].trim();
        try {
            const payload = yield TokenService_1.default.verifyToken(accessToken);
            if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return next(new HttpException_1.default(401, 'Unauthorized'));
            }
            const user = yield UserSchema_1.default.findById(payload.id)
                .select('-password')
                .exec();
            if (!user) {
                return next(new HttpException_1.default(401, 'Unauthorized'));
            }
            req.user = user;
            return next();
        }
        catch (error) {
            return next(new HttpException_1.default(401, 'Unauthorized'));
        }
    });
}
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map