import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import normalize from './Normalize';

type CardMusicProps = {
  image: string;
  title: string;
  description: string;
  id: string;
}

export default function CardMusic(props: CardMusicProps) {
  // @ts-ignore
  const isDark = useSelector(state => state.userReducer.dark);
  const style = isDark ? colorsDark : colorsLight;

  const source = typeof props.image === 'string' ? { uri: props.image } : props.image;
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15
    },
    imageContainer: {
      width: normalize(92),
      height: normalize(92),
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
        <Image source={source} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title]}>{props.title}</Text>
        <Text style={[styles.description]}>{props.description}</Text>
      </View>
    </View>
  );
}

