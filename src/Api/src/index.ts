import App from "./app";
import SpotifyController from "./controllers/spotifyController";
import UserController from "./controllers/userController";
import dotenv from 'dotenv'

dotenv.config();
const app = new App(
    [new SpotifyController(), new UserController()],
    Number(process.env.PORT)
);

app.listen();