export class User {
  private _idFlad: string;
  private _idSpotify: string;
  private _email: string;
  private _createdAt: Date;
  private _name: string;
  public image: string;

  constructor(idFlad: string, idSpotify: string, email: string, createdAt: Date, name: string, image: string) {
    this._name = name;
    this._idFlad = idFlad;
    this._idSpotify = idSpotify;
    this._createdAt = createdAt;
    this._email = email;
    this.image = image;
  }

  get idFlad(): string {
    return this._idFlad;
  }
  get idSpotify(): string {
    return this._idSpotify;
  }
  get email(): string {
    return this._email;
  }
  get createAt(): Date {
    return this._createdAt;
  }
  get name(): string {
    return this._name;
  }
}