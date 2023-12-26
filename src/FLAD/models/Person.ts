export class Person {
    private _id: string;
    private _name: string;
    public image: string;

    constructor(id: string, name: string, image: string) {
        this._id = id;
        this._name = name;
        this.image = image;
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
}