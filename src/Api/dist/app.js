"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initDatabase();
        this.initMiddleware();
        this.initControllers(controllers);
    }
    initMiddleware() {
        this.express.use((0, cors_1.default)());
        this.express.use((0, cookie_parser_1.default)());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use(body_parser_1.default.json());
        this.express.use(body_parser_1.default.urlencoded({
            extended: true
        }));
    }
    initControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use('/api', controller.router);
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`[server] : App listening on the port ${this.port}`);
        });
    }
    initDatabase() {
        const MONGO_URL = `mongodb+srv://FladDev:${config_1.MONGO_PASSWORD}@flad.mliekr2.mongodb.net/?retryWrites=true&w=majority`;
        mongoose_1.default.connect(MONGO_URL)
            .then(() => console.log("Connect to MongoDB database successfully"))
            .catch(error => console.log("Error connecting : " + error));
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map