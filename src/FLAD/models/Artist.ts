export default class Artist {
    private _id: string;
    private _name: string;
    private _url: string;

    constructor(id: string, name: string, url: string) {
        this._id = id;
        this._name = name;
        this._url = url;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }
}