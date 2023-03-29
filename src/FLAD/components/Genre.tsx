import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Music from "../Model/Music";
import { Artist } from "./Artist";

export const ArtistLayout = () => {
  const MUSIC_LIST: Music[] = [
    new Music("La pharmacie", "Jul", require("../assets/images/jul.png")),
    new Music("Deux frères", "PNL", require("../assets/images/pnl.png")),
    new Music("Bambina", "PNL", "https://upload.wikimedia.org/wikipedia/en/a/a0/PNL_-_Dans_la_l%C3%A9gende.png"),
    new Music("Stratos", "Kekra", "https://images.genius.com/ddc9cadedd1d4cef0860aaa85af9cd46.705x705x1.png"),
    new Music("Autobahn", "Sch", "https://images.genius.com/83b6c98680d38bde1571f6b4093244b5.1000x1000x1.jpg"),
    new Music("Freeze Raël", "Freeze Corleone", "https://intrld.com/wp-content/uploads/2020/08/freeze-corleone-la-menace-fanto%CC%82me.png"),
    new Music("Blanka", "PNL", require("../assets/images/pnl.png")),
    new Music("Kratos", "PNL", "https://upload.wikimedia.org/wikipedia/en/a/a0/PNL_-_Dans_la_l%C3%A9gende.png"),
  ]
  const [artists, setArtists] = useState<Music[]>(MUSIC_LIST);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {artists.map((artist, i) => (
        <Artist
          artist={artist}
          key={artist.title}
          onPress={() => {
            const tmppArtist = new Music("Kratos", "PNL", "https://upload.wikimedia.org/wikipedia/en/a/a0/PNL_-_Dans_la_l%C3%A9gende.png");

            artists.push(tmppArtist);
            setArtists([...artists]);
          }}
        />
      ))}

    </ScrollView>

  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});