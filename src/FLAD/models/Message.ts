export default class Message {
    private _id: string;
    private _content: string;
    private _sender: string;
    private _date: Date;
    private _audio: string;

    constructor(id: string, content: string, sender: string, date: Date, audio: string = '') {
        this._id = id;
        this._content = content;
        this._sender = sender;
        this._date = date;
        this._audio = audio;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get sender(): string {
        return this._sender;
    }

    set sender(value: string) {
        this._sender = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get audio(): string {
        return this._audio;
    }

    set audio(value: string) {
        this._audio = value;
    }
}