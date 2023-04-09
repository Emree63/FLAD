import Controller from '../Icontroller';
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../../middleware/exeption/httpExeption';
import axios from 'axios';
import CryptString from './crypt';
import qs from 'qs';

class SpotifyController implements Controller {
    public path = '/spotify';
    public router = Router();
    
    constructor() {
      console.log("useeeee");

        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}/exchange`,this.login);
        this.router.get(`${this.path}/callback`,this.getAccessToken);
        this.router.get(`${this.path}/refresh`,this.getRefreshToken);
        this.router.get(`${this.path}/spot`, this.getSpot);
        
    }

     
     private readonly API_URL = "https://accounts.spotify.com/api/token";
     private readonly CLIENT_ID = "1f1e34e4b6ba48b388469dba80202b10";
     private readonly CLIENT_SECRET = "779371c6d4994a68b8dd6e84b0873c82";
     private readonly CALLBACK_2 = 'https://flad-api-production.up.railway.app/api/spotify/callback';
     private readonly SCOPES ='user-read-private user-read-email user-read-playback-state user-read-currently-playing user-read-recently-played playlist-modify-public ugc-image-upload user-modify-playback-state';
     private readonly clientRedirect= 'spotify_final_redirect-uri-key';

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

      console.log("useeeee== login");
        try {
            
            const redirectResponse =  req.query.redirectUrl ? req.query.redirectUrl : req.headers.referer;
            res.cookie(this.clientRedirect, redirectResponse);
            console.log("aloorrr si c'est niquuuuuuuuuuuueeee" +this.CALLBACK_2+ "gennnnnnnnnrree vraiiiiiiiment ");
            res.redirect('https://accounts.spotify.com/authorize?' +
            qs.stringify({
              response_type: 'code',
              client_id: this.CLIENT_ID,
              scope: this.SCOPES,
              redirect_uri: this.CALLBACK_2,
            }));
            
           
        } catch (error) {
            next(new HttpException(400, 'Cannot create spot'));
        }  
        
        
    };

    private getRefreshToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
    
      console.log('UUse2');

        try {
            const params = req.query.refresh_token;
            
            if (!req.query.refresh_token) {
              return res.json({
                "error": "Parameter refresh_token missing"
              });
            }          
            let authOptions = {
              method: 'POST',
              url: 'https://accounts.spotify.com/api/token',
              data: qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: params
              }),
              headers: {
                'Authorization': 'Basic ' + ( Buffer.from(this.CLIENT_ID + ':' + this.CLIENT_SECRET).toString('base64')),
                'Content-Type' : 'application/x-www-form-urlencoded'
              },
              json: true
            };
          
            axios(authOptions)
            .then(session => {
              if(session.status === 200){
                console.log('### Information : responce ###' + JSON.stringify( session.data) );
                console.log('### Information : refresh_token ###' + session.data.refresh_token); 
                
                res.send({
                    "access_token": session.data.access_token,
                    "refresh_token": session.data.refresh_token,
                    "expires_in": session.data.expires_in
                });
              }});
              console.log("goood");
                } catch (error) {
          console.log("errur");
            next(new HttpException(400, 'Cannot create post'));
        }  
        
      }    
    
  

    public getSpot = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response | void> => {
    const spots = [
      {
        name: "blue",
        sourceUrl: "https://cdns-images.dzcdn.net/images/artist/399e7e760d8fedf3cc2891e9c0c41658/200x200-000000-80-0-0.jpg",
        index: 3
      },
      {
        name: "strange history",
        sourceUrl: "https://images.genius.com/339dfe2a7c0adf9a5d08febf29a845f4.1000x1000x1.jpg",
        index: 7
      },
      {
        name: "oboy album",
        sourceUrl: "https://i.pinimg.com/originals/ad/cc/d5/adccd58a0d0ff516a6114703cd05810e.jpg",
        index: 1
      }
    ];
    try {
      res.send(spots);
    
    } catch (error) {
      console.log('heuuuuuuuuuuuuuuuuuuuuubizzzaaarrreeee');
      console.log(error);
      next(new HttpException(400, 'On peut pas avoir darray mec'));
    }    }


    private getAccessToken = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<Response | void> => {
    console.log("useeeee== accesToken");

    let code  = req.query.code;
    let state = req.query.state || null;
    let storedredirectUri = req.cookies ? req.cookies[this.clientRedirect] : null;
 
    var authOptions = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      data: qs.stringify({
        code: code,
        redirect_uri: this.CALLBACK_2,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Authorization': 'Basic ' + ( Buffer.from(this.CLIENT_ID + ':' + this.CLIENT_SECRET).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      json: true
    };
    try {
    var resp = await axios(authOptions);
    if (resp.status === 200) {
      console.log('oon esttt laaa');
      let access_token = resp.data.access_token;
      let expiration =resp.data.expires_in;
      let refresh = resp.data.refresh_token
      console.log(access_token);
   
      res.clearCookie(this.clientRedirect);
    res.redirect(`${storedredirectUri}?` +
    qs.stringify({
      "access_token": access_token,
      "expires_in": expiration,
      "refresh_token" : refresh
    }));
    }
    } catch (error) {
      console.log('heuuuuuuuuuuuuuuuuuuuuubizzzaaarrreeee');
      console.log(error);
      next(new HttpException(400, 'On peut pas te connecter mec'+ error.message));
    }
    


  };

    
}
export default SpotifyController;
