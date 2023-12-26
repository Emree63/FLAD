import Message from "./Message";

export default class Conversation {
    private _id: string;
    private _name: string;
    private _image: string;
    private _lastMessage: Message;

    constructor(id: string, name: string, image: string, lastMessage: Message) {
        this._id = id;
        this._name = name;
        this._image = image;
        this._lastMessage = lastMessage;
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

    get image(): string {
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }

    get lastMessage(): Message {
        return this._lastMessage;
    }

    set lastMessage(value: Message) {
        this._lastMessage = value;
    }
}