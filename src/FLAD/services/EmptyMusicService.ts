import Music from "../models/Music";
import IMusicService from "./musics/interfaces/IMusicService";

export default class EmptyMusicService implements IMusicService {
    getMusicById(id: string): Promise<Music> {
        throw new Error("Method not implemented.");
    }
    getRecentlyPlayedMusic(): Promise<string | null> {
        throw new Error("Method not implemented.");
    }
    getCurrentlyPlayingMusic(): Promise<string | null> {
        throw new Error("Method not implemented.");
    }
    getMusicsWithIds(ids: string[]): Promise<Music[]> {
        throw new Error("Method not implemented.");
    }
    getMusicsWithName(name: string): Promise<Music[]> {
        throw new Error("Method not implemented.");
    }
    addToPlaylist(idTrack: string): void {
        throw new Error("Method not implemented.");
    }
    getSimilarTracks(idTrack: string): Promise<Music[]> {
        throw new Error("Method not implemented.");
    }
}