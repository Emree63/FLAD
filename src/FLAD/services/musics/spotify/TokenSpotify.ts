import axios from "axios";
import configs from "../../../constants/config";

export default class TokenSpotify {
    private _accessToken: string = '';
    private _refreshToken: string;
    private _tokenEnd: Date;

    constructor(refreshToken: string) {
        this._refreshToken = refreshToken;
        this._tokenEnd = new Date();
        this._tokenEnd.setSeconds(this._tokenEnd.getSeconds() - 10);
    }

    async getAccessToken(): Promise<string> {
        if (this._isTokenExpired()) {
            await this._getRefreshToken();
        }
        return this._accessToken;
    }

    private async _getRefreshToken(): Promise<void> {

        const response = await axios.get(
            configs.API_URL + '/spotify/refresh?refresh_token=' + this._refreshToken
        )
        if (response.status === 200) {
            const responseData = await response.data;
            this._accessToken = responseData.access_token;
            this._tokenEnd = new Date();
            this._tokenEnd.setSeconds(this._tokenEnd.getSeconds() + responseData.expires_in)
        } else {
            console.log(`Error refreshing token: ${response.status}`)
        }
    }

    private _isTokenExpired(): boolean {
        return new Date() > this._tokenEnd;
    }

}