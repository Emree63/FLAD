"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const spotifyController_1 = __importDefault(require("./controllers/spotifyController"));
const userController_1 = __importDefault(require("./controllers/userController"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = new app_1.default([new spotifyController_1.default(), new userController_1.default()], Number(process.env.PORT));
console.log(process.env.TMP);
app.listen();
//# sourceMappingURL=index.js.map