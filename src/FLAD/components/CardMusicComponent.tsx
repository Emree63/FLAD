import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import normalize from './Normalize';
import Music from '../models/Music';
import Artist from '../models/Artist';

type CardMusicProps = {
  music: Music
}

export default function CardMusic(props: CardMusicProps) {
  // @ts-ignore
  const isDark = useSelector(state => state.userReducer.dark);
  const style = isDark ? colorsDark : colorsLight;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15
    },
    imageContainer: {
      width: normalize(82),
      height: normalize(82),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 20,
      marginLeft: 20
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10
    },
    textContainer: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    title: {
      fontWeight: 'bold',
      color: style.Text,
      fontSize: normalize(23),
      marginBottom: 10
    },
    description: {
      color: style.Text,
      fontSize: normalize(18)
    },
    currentMusic: {
      color: 'red'
    }
  });
  return (

    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: props.music.cover }} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title]}>{props.music.name}</Text>
        <Text style={[styles.description]}>{props.music.artists.map((artist: Artist) => artist.name).join(', ')}</Text>
      </View>
    </View>
  );
}

