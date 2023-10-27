export default class Artist {
    private id: string;
    private name: string;
    private _url: string;

    constructor(id: string, name: string, url: string) {
        this.id = id;
        this.name = name;
        this._url = url;
    }

    get url(): string {
        return this.url;
    }
}