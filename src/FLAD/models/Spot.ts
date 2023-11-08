import Music from "./Music";
import { Person } from "./Person";

export class Spot {
  private _user: string;
  private _music: Music;
  private _date: Date;

  constructor(userId: string, music: Music, date: Date) {
    this._user = userId;
    this._music = music;
    this._date = date;
  }

  get userSpotifyId(): string {
    return this._user;
  }

  set userSpotifyId(value: string) {
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