import express, { Application } from 'express';
import cors from 'cors';
import Controller from './controller/Icontroller';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import cookieParser from 'cookie-parser';

class App {
    public express: Application;
    public port: number;
    public dataBase: null;

    public server : any;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.dataBase = null;
        
        this.initialiseDatabase();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        
    }

    private initialiseMiddleware(): void {
        this.express.use(cors());
        this.express.use(cookieParser());

        
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({
            extended: true
          }));

    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
            this.express.get('/toto', (req, res) => {
                res.send('Hello World!');
              })
        });
    }

   

    public listen(): void {
        const server = this.express.listen(this.port, () => {
            console.log(`⚡️[server] : App listening on the port ${this.port}`);
        });
    }
    
    private initialiseDatabase(): void {
        const uri = "mongodb+srv://fladDevDb:ZslYlNRWIOUU7i6o@fladcluster.b29tytu.mongodb.net/?retryWrites=true&w=majority"
        mongoose.connect(uri)
        .then(() => console.log("Connect to MongoDB database successfully"))
        .catch(err => console.log("Error connecting : "+ err ));
    }
    
}

export default App;