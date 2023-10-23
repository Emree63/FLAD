import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Controller from './controllers/interfaces/IController';
import mongoose from 'mongoose';

class App {
    public express: Application;
    public port: number;
    public dataBase: null;
    public server: any;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initDatabase();
        this.initMiddleware();
        this.initControllers(controllers);
    }

    private initMiddleware(): void {
        this.express.use(cors());
        this.express.use(cookieParser());
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({
            extended: true
        }));
    }

    private initControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`[server] : App listening on the port ${this.port}`);
            console.log(`${process.env.MONGO_PASSWORD}`)
        });
    }

    private initDatabase(): void {
        const MONGO_URL = `mongodb+srv://FladDev:${process.env.MONGO_PASSWORD}@flad.mliekr2.mongodb.net/?retryWrites=true&w=majority`;
        mongoose.connect(MONGO_URL)
            .then(() => console.log("Connect to MongoDB database successfully"))
            .catch(error => console.log("Error connecting : " + error));
    }
}

export default App;