import Music from "./Music";
import { Person } from "./Person";

export class Spot {
  private _id: string;
  private _user: Person;
  private _music: Music;
  public distance: string;
  private _date: Date;

  constructor(id: string, user: Person, music: Music, distance: string, date: Date) {
    this._id = id;
    this._user = user;
    this._music = music;
    this.distance = distance;
    this._date = date;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get user(): Person {
    return this._user;
  }

  set user(value: Person) {
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