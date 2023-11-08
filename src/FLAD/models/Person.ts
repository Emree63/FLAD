export class Person {
    private _id: string;
    private _name: string;
    public image: string;

    constructor(id: string, idSpotify: string, name: string, email: string, creationDate: Date, image: string) {
        this._id = id;
        this._name = name;
        this.image = image;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }
}