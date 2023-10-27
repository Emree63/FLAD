import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import normalize from './Normalize';

type Flady = {
    image: string | object;
};

export default function FladyComponent(monFlady: Flady) {
    const source = typeof monFlady.image === 'string' ? { uri: monFlady.image } : monFlady.image;
    return (
        <View style={styles.container}>
            <Image source={source} style={styles.image} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalize(132),
        height: normalize(132),
        borderRadius: 30,
        backgroundColor: 'white',
        marginHorizontal: normalize(12),
        overflow: 'hidden',
    },
    image: {
        width: normalize(180),
        height: normalize(180),
        marginLeft: -1
    }
})