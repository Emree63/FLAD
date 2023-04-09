export default class CryptString{

    stringCrypt: string;
    
    constructor(length : number){
        this.stringCrypt = this.generateRandomString(length);
    }
    generateRandomString (length : number){
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      
        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}


