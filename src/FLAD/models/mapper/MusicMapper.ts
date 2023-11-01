import Music from "../Music";

export default class MusicMapper {
  static toModel(music: any): Music {
    return new Music(
      music.id,
      music.name,
      music.artists[0].name,
      music.album.images[0].url,
      music.preview_url
    );
  }
}