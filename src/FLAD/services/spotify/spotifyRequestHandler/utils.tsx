import axios, { AxiosResponse } from "axios";
import { MY_SECURE_AUTH_STATE_KEY, MY_SECURE_AUTH_STATE_KEY_REFRESH } from "../../../screens/Register";
import * as SecureStore from 'expo-secure-store';

export type Methods = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export interface FetchOptions {
    /** The headers that will be applied to the request when sent. */
    headers?: Record<string, string>;
    /** The type of HTTP method being used. */
    method?: Methods;
    /** Parameters used for search queries.*/
    params?: Record<string, any>;
    /**If present, this refers to the JSON data that will be included in the request body. */
    body?: Record<string, string | boolean | number | (string | boolean | number)[]>;
}

export class RequestHandler {
    private _version: `v${number}` = 'v1';
    
    get version(): string {
        return this._version;
    }
    public async spotifyFetch(url: string, options: FetchOptions = {}, token: string): Promise<AxiosResponse<any, any>> {
        try {
            const resp = await axios({
                url: `https://api.spotify.com/${this.version}${url}`,
                method: options.method || 'GET',
                params: options.params,
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: 'application/json',
                    ...options.headers
                },
                data: options.body
            });
            
        return resp;
        }
        catch(error : any){
            const errorMessage = error.response.data?.error?.message;
            if (errorMessage === "Invalid access token" || errorMessage === "The access token expired" ) {
                console.log('### Warning ! ### try refresh token Request Handler ' +error);

                const newToken = await this.refreshToken();
                console.log('### GOOD Warning ! ### new token Request Handler ' +newToken);
                // Mettez à jour le token dans le store ou le reducer ici
                return this.spotifyFetch(url, options, newToken);
            }
            else {
                console.log('### Error ! ### while fetching Data in the SPotify Request Handler ' +error);
                throw error;
            }
        }
    }
    private async refreshToken(): Promise<string> {

        // Faites une demande à votre API pour obtenir un nouveau token Spotify
        let refreshToken = await SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY_REFRESH);
        console.log('refresh token : ' + refreshToken);
        const response = await axios.get(`https://flad-api-production.up.railway.app/api/spotify/refresh?refresh_token=${refreshToken}`);
        // Renvoie le nouveau token
        const {
            access_token :  access_token,
            refresh_token: refresh_token,
          } = response.data as SpotifyAuthResponse
        console.log('new access token : ' + access_token);
        console.log('new refresh token : ' + refresh_token);
        await SecureStore.setItemAsync(MY_SECURE_AUTH_STATE_KEY, access_token);
        return access_token;
    }
}


interface SpotifyAuthResponse {
    access_token: string;
    refresh_token: string;
  }