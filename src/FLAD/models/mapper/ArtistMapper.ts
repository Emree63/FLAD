import Artist from "../Artist";

export default class ArtistMapper {
    static toModel(artist: any): Artist {
        return new Artist(artist.id, artist.name, (artist?.images?.[0]?.url ?? ""), artist.external_urls.spotify);
    }
}