import { View, Text, StyleSheet, Image } from 'react-native';
import Music from '../models/Music';
import normalize from './Normalize';

export interface RenderCellProps {
    music: Music;
}
export const SimilarMusic = (props: RenderCellProps) => {
    return (
        <View style={styles.similarContainer}>
            <Image source={{ uri: props.music.cover }} style={styles.similarPoster}></Image>
            <Text numberOfLines={1} style={styles.similarTitle}>{props.music.name}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({

    similarContainer: {
        marginHorizontal: 6
    },
    similarTitle: {
        color: "#DADADA",
        paddingTop: 5,
        paddingLeft: 5,
        fontWeight: "600",
        maxWidth: normalize(130),
        fontSize: normalize(14)
    },
    similarPoster: {
        height: normalize(130),
        width: normalize(130),
        borderRadius: 12
    }
})
