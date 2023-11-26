import axios from "axios";
import Music from "../../../models/Music";
import IMusicService from "../interfaces/IMusicService";
import TokenSpotify from "./TokenSpotify";
import MusicMapper from "../../../models/mapper/MusicMapper";

export default class SpotifyService implements IMusicService {
    private readonly API_URL = "https://api.spotify.com/v1";
    private readonly PLAYLIST_NAME = "Flad's discovery";
    private _token: TokenSpotify;
    private _idSpotify: string;

    constructor(refreshToken: string, idSpotify: string) {
        this._token = new TokenSpotify(refreshToken);
        this._idSpotify = idSpotify;
    }

    async getMusicById(id: string): Promise<Music> {
        const access_token = await this._token.getAccessToken();
        try {
            const response = await axios.get(`${this.API_URL}/tracks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
            });
            return MusicMapper.toModel(response.data)
        } catch (error: any) {
            console.log("Error retrieving music information : " + error)
            throw new Error("Error retrieving music information : " + error)
        }
    }

    async getRecentlyPlayedMusic(limit: number = 1): Promise<string | null> {
        const access_token = await this._token.getAccessToken();

        const response = await axios.get(`${this.API_URL}/me/player/recently-played?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
        });
        if (response.data.items.length === 0) {
            return null;
        }
        return response.data.items[0].track.id
    }

    async getCurrentlyPlayingMusic(): Promise<string | null> {
        const access_token = await this._token.getAccessToken();

        const response = await axios.get(`${this.API_URL}/me/player/currently-playing`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
        });

        if (response.data.item === undefined) {
            return null;
        }
        return response.data.item.id
    }

    async getMusicsWithIds(ids: string[]): Promise<Music[]> {
        const access_token = await this._token.getAccessToken();
        var url = `${this.API_URL}/tracks?market=FR&ids=`;
        if (ids.length == 0) {
            return [];
        }

        url += ids.join('%2C');

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
            });
            const tracksData = response.data.tracks.filter((musicData: any) => musicData !== null);
            return tracksData.map((musicData: any) => MusicMapper.toModel(musicData));
        } catch (error: any) {
            console.log(error)
            return [];
        }
    }

    async getMusicsWithName(name: string, limit: number = 20, offset: number = 0): Promise<Music[]> {
        const access_token = await this._token.getAccessToken();

        try {
            const response = await axios.get(`${this.API_URL}/search?q=track%3A${name}&type=track&market=fr&limit=${limit}&offset=${offset}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
            });
            return response.data.tracks.items.map((musicData: any) => MusicMapper.toModel(musicData));
        } catch (error: any) {
            console.log(error)
            return [];
        }
    }

    async _getPlaylistId(): Promise<string> {
        const access_token = await this._token.getAccessToken();

        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        };
        const response = await axios.get(`${this.API_URL}/me/playlists?limit=50`, { headers });
        const fladPlaylist = response.data.items.filter((playlist: any) => playlist.name === this.PLAYLIST_NAME);

        if (fladPlaylist.length >= 1) {
            return fladPlaylist[0].id;
        }

        return await this._createPlaylist();
    }

    async _createPlaylist(): Promise<string> {
        const access_token = await this._token.getAccessToken();
        const data = {
            name: this.PLAYLIST_NAME,
            description: 'Retrouvez toutes vos découvertes faites sur FladMusic 🎵',
            public: true
        };
        var headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        const response = await axios.post(`${this.API_URL}/users/${this._idSpotify}/playlists`, data, { headers });

        return response.data.id;
    }

    async _isInPlaylist(idTrack: string, idPlaylist: string): Promise<Boolean> {
        const access_token = await this._token.getAccessToken();
        const response = await axios.get(`${this.API_URL}/playlists/${idPlaylist}/tracks?limit=100`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
        });
        var nbTracks = response.data.items.filter((item: any) => item.track.id === idTrack).length;

        return (nbTracks >= 1) ? true : false;
    }

    async addToPlaylist(idTrack: string): Promise<void> {
        var idPlaylist = await this._getPlaylistId();

        if (await this._isInPlaylist(idTrack, idPlaylist)) {
            return;
        }
        const access_token = await this._token.getAccessToken();

        const data = {
            uris: [`spotify:track:${idTrack}`],
            position: 0
        };
        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        };

        await axios.post(`${this.API_URL}/playlists/${idPlaylist}/tracks`, data, { headers })
            .then(response => {
                console.log('Song successfully added to playlist.');
            })
            .catch(error => {
                console.error('Error adding song to playlist: ', error);
            });
    }

    async getSimilarTracks(idTrack: string, limit: number = 20, offset: number = 0): Promise<Music[]> {
        const access_token = await this._token.getAccessToken();

        try {
            const response = await axios.get(`${this.API_URL}/recommendations?limit=${limit}&offset=${offset}&seed_tracks=${idTrack}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
            });
            return response.data.tracks.map((musicData: any) => MusicMapper.toModel(musicData));
        } catch (error: any) {
            console.log(error)
            return [];
        }
    }

    async getImageArtistWithId(idArtist: string): Promise<string | null> {
        const access_token = await this._token.getAccessToken();

        try {
            const response = await axios.get(`${this.API_URL}/artists/${idArtist}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
            });
            return response.data.images[0].url;
        } catch (error: any) {
            console.log(error)
            return null;
        }
    }

}