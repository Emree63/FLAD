import Music from "../../../model/Music";

export default interface IMusicService {
    getMusicById(id: string): Promise<Music>;
    getRecentlyPlayedMusic(): Promise<string | null>;
    getCurrentlyPlayingMusic(): Promise<string | null>;
    getMusicsWithIds(ids: string[]): Promise<Music[]>;
    getMusicsWithName(name: string): Promise<Music[]>;
    addToPlaylist(idTrack: string): void;
    getSimilarTracks(idTrack: string): Promise<Music[]>;
    getImageArtistWithId(idArtist: string): Promise<string | null>;
}