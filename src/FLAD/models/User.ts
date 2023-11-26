export class User {
  private _id: string;
  private _idSpotify: string;
  private _name: string;
  private _email: string;
  private _creationDate: Date;
  public image: string;

  constructor(id: string, idSpotify: string, name: string, email: string, creationDate: Date, image: string) {
    this._id = id;
    this._idSpotify = idSpotify;
    this._name = name;
    this._email = email;
    this._creationDate = creationDate;
    this.image = image;
  }

  get id(): string {
    return this._id;
  }
  get idSpotify(): string {
    return this._idSpotify;
  }
  get name(): string {
    return this._name;
  }
  get email(): string {
    return this._email;
  }
  get creationDate(): Date {
    return this._creationDate;
  }
}