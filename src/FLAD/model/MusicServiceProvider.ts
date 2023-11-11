import EmptyMusicService from "../services/EmptyMusicService";
import IMusicService from "../services/musics/interfaces/IMusicService";
import SpotifyService from "../services/musics/spotify/SpotifyService";

export class MusicServiceProvider {
    static musicService: IMusicService;

    static initSpotify(refreshToken: string, idSpotify: string) {
        this.musicService = new SpotifyService(refreshToken, idSpotify);
    }

    static resetService() {
        this.musicService = new EmptyMusicService();
    }
}