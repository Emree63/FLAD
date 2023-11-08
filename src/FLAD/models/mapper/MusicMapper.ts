import Music from "../Music";
import ArtistMapper from "./ArtistMapper";

export default class MusicMapper {
  static toModel(music: any): Music {
    const artists = music.artists.map((artist: any) => ArtistMapper.toModel(artist));
    return new Music(
      music.id,
      music.name,
      music.external_urls.spotify,
      artists,
      music.album.images[0].url,
      music.album.release_date.split('-')[0],
      music.duration_ms / 1000,
      music.explicit,
      music.preview_url
    );
  }
}