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
const config_1 = require("../config");
const HttpException_1 = __importDefault(require("../exception/HttpException"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
class SpotifyController {
    constructor() {
        this.path = '/spotify';
        this.router = (0, express_1.Router)();
        this.API_URL = "https://accounts.spotify.com/api/token";
        this.CALLBACK = 'http://localhost:8080/api/spotify/callback';
        this.SCOPES = 'user-read-private user-read-email user-read-playback-state user-read-currently-playing user-read-recently-played playlist-modify-public ugc-image-upload user-modify-playback-state';
        this.clientRedirect = 'spotify_final_redirect-uri-key';
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const redirectResponse = req.query.redirectUrl ? req.query.redirectUrl : req.headers.referer;
                res.cookie(this.clientRedirect, redirectResponse);
                res.redirect('https://accounts.spotify.com/authorize?' +
                    qs_1.default.stringify({
                        response_type: 'code',
                        client_id: config_1.CLIENT_ID_SPOTIFY,
                        scope: this.SCOPES,
                        redirect_uri: this.CALLBACK,
                    }));
            }
            catch (error) {
                next(new HttpException_1.default(400, "Cannot connect: " + error.message));
            }
        });
        this.getRefreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = req.query.refresh_token;
                if (!req.query.refresh_token) {
                    return res.json({
                        "error": "Parameter refresh_token missing"
                    });
                }
                let authOptions = {
                    method: 'POST',
                    url: 'https://accounts.spotify.com/api/token',
                    data: qs_1.default.stringify({
                        grant_type: 'refresh_token',
                        refresh_token: params
                    }),
                    headers: {
                        'Authorization': 'Basic ' + (Buffer.from(config_1.CLIENT_ID_SPOTIFY + ':' + config_1.CLIENT_SECRET_SPOTIFY).toString('base64')),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    json: true
                };
                (0, axios_1.default)(authOptions)
                    .then(session => {
                    if (session.status === 200) {
                        console.log('### Information : responce ###' + JSON.stringify(session.data));
                        console.log('### Information : refresh_token ###' + session.data.refresh_token);
                        res.send({
                            "access_token": session.data.access_token,
                            "refresh_token": session.data.refresh_token,
                            "expires_in": session.data.expires_in
                        });
                    }
                });
                console.log("goood");
            }
            catch (error) {
                console.log("errur");
                next(new HttpException_1.default(400, 'Cannot create post'));
            }
        });
        this.getAccessToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let code = req.query.code;
            let storedredirectUri = req.cookies ? req.cookies[this.clientRedirect] : null;
            var authOptions = {
                method: 'POST',
                url: this.API_URL,
                data: qs_1.default.stringify({
                    code: code,
                    redirect_uri: this.CALLBACK,
                    grant_type: 'authorization_code'
                }),
                headers: {
                    'Authorization': 'Basic ' + (Buffer.from(config_1.CLIENT_ID_SPOTIFY + ':' + config_1.CLIENT_SECRET_SPOTIFY).toString('base64')),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                json: true
            };
            try {
                var resp = yield (0, axios_1.default)(authOptions);
                if (resp.status === 200) {
                    let access_token = resp.data.access_token;
                    let expiration = resp.data.expires_in;
                    let refresh = resp.data.refresh_token;
                    console.log(access_token);
                    res.clearCookie(this.clientRedirect);
                    res.redirect(`${storedredirectUri}?` +
                        qs_1.default.stringify({
                            "access_token": access_token,
                            "expires_in": expiration,
                            "refresh_token": refresh
                        }));
                }
            }
            catch (error) {
                console.log(error);
                next(new HttpException_1.default(400, 'Error connection: ' + error.message));
            }
        });
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(`${this.path}/exchange`, this.login);
        this.router.get(`${this.path}/callback`, this.getAccessToken);
        this.router.get(`${this.path}/refresh`, this.getRefreshToken);
    }
}
exports.default = SpotifyController;
//# sourceMappingURL=spotifyController.js.map