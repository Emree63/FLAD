import axios from "axios";
import MusicFactory from "../../Model/factory/MusicFactory";
import Music from "../../Model/Music";
import { FetchOptions, RequestHandler } from "./spotifyRequestHandler/utils";

export default class SpotifyService implements IspotifyService {
    private readonly API_URL = "https://flad-api-production.up.railway.app/api/";
    private spotifyRequestHandler = new RequestHandler();
	private readonly token : string; 
    constructor(token : string) {
        this.token = token;
    }
  	// get id(){
	// 	return this.identification;
	// }

	// async apiAuth(url : string) {
	// 	await this.identification.setCode(url);
    // 	// this.request = ApiSpotifyRequests(await this.identification.createToken());
	// }  
	public async getMusicById(idMusic : string): Promise<Music>{
		var requestData :string =  '/tracks/' + idMusic;
		const respMusic = await this.spotifyRequestHandler.spotifyFetch(requestData, undefined,this.token);
		if (respMusic.status != 200) {
		}
		return MusicFactory.mapFromSpotifyTrack(respMusic.data);
	}

	public async getUserCurrentMusic(): Promise<string | null>{
		var requestData :string = '/me/player/currently-playing';
		const respMusic = await this.spotifyRequestHandler.spotifyFetch(requestData, undefined,this.token);
		if (respMusic.status != 200) {
			return null;
		}
		return respMusic.data.items.track.id;
	}

	public async getUserRecentlyPlayedMusic(): Promise<string | null>{
		var requestData :string = '/me/player/recently-played';
		const respMusic = await this.spotifyRequestHandler.spotifyFetch(requestData, undefined,this.token);
		if (respMusic.status != 200) {
		}
		if (respMusic.data.items.length <= 0) {
			return null;
		  }
		return respMusic.data.items[0].track.id;
	}

	public async playMusic(idMusic : string): Promise<void>{
		var requestData :string = '/me/player/play';

		const fetchOptions: FetchOptions = {
			method: 'PUT',
			body: {
			  uris: [`spotify:track:${idMusic}`],
			  position_ms: 0
			}
		  };
		const respMusic = await this.spotifyRequestHandler.spotifyFetch(requestData, fetchOptions,this.token);
		// need to handle when 
		// if (respMusic.status != 200) {
		// 	if (respMusic.status == 400 && respMusic.data.message =='need to use Spotify premium'){

		// 	}
		// }
		// if(respMusic){
		// 	console.log(respMusic);
		// 	console.log(respMusic.data);

		// }
		return ;
	}
	
	async getSpotifyCredentials() {
		const res = await axios.get(this.API_URL)
        // then  verify error
		const spotifyCredentials = res.data;
		return spotifyCredentials
	  }

}
