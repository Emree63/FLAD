import App from "./app";
import SpotifyController from "./controller/spotify.controller";
import UserController from "./controller/user.controller";
import dotenv from 'dotenv'

dotenv.config();
const app = new App(
    [new SpotifyController(), new UserController()],
    Number(process.env.PORT)
);

app.listen();