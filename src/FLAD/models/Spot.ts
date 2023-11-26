import Music from "./Music";

export class Spot {
  private _id: string;
  private _user: string;
  private _music: Music;
  private _date: Date;

  constructor(id: string, user: string, music: Music, date: Date) {
    this._id = id;
    this._user = user;
    this._music = music;
    this._date = date;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get user(): string {
    return this._user;
  }

  set user(value: string) {
    this._user = value;
  }

  get music(): Music {
    return this._music;
  }

  set music(value: Music) {
    this._music = value;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }
}