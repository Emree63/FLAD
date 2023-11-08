import Artist from "./Artist";

export default class Music {
  private _id: string;
  private _name: string;
  private _url: string;
  private _artists: Artist[];
  private _cover: string;
  private _date: number;
  private _duration: number;
  private _explicit: boolean = false;
  private _trackPreviewUrl: string;

  constructor(
    id: string,
    name: string,
    url: string,
    artists: Artist[],
    cover: string,
    date: number,
    duration: number,
    explicit: boolean,
    trackPreviewUrl: string
  ) {
    this._id = id;
    this._name = name;
    this._url = url;
    this._artists = artists;
    this._cover = cover;
    this._date = date;
    this._duration = duration;
    this._explicit = explicit;
    this._trackPreviewUrl = trackPreviewUrl;
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

  get artists(): Artist[] {
    return this._artists;
  }

  set artists(value: Artist[]) {
    this._artists = value;
  }

  get cover(): string {
    return this._cover;
  }

  set cover(value: string) {
    this._cover = value;
  }

  get date(): number {
    return this._date;
  }

  set date(value: number) {
    this._date = value;
  }

  get duration(): number {
    return this._duration;
  }

  set duration(value: number) {
    this._duration = value;
  }

  get explicit(): boolean {
    return this._explicit;
  }

  set explicit(value: boolean) {
    this._explicit = value;
  }

  get trackPreviewUrl(): string {
    return this._trackPreviewUrl;
  }

  set trackPreviewUrl(value: string) {
    this._trackPreviewUrl = value;
  }
}

