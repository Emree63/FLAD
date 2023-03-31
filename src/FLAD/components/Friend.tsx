import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { color } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { GraphicalCharterDark } from '../assets/GraphicalCharterDark';
import { GraphicalCharterLight } from '../assets/GraphicalCharterLight';
import normalize from './Normalize';

type FriendProps = {
    image: string;
    name: string;
    lastMessage: string;
}

export default function Friend(friend: FriendProps) {
    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);

    const style = isDark ? GraphicalCharterDark : GraphicalCharterLight;

    const source = typeof friend.image === 'string' ? { uri: friend.image } : friend.image;

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 9,
        },
        image: {
            marginLeft: 15,
            marginRight: 12,
            width: 55,
            height: 55,
            borderRadius: 180
        },
        name: {
            fontWeight: "500",
            color: style.Text,
            fontSize: normalize(16)
        },
        lastMessageContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            maxWidth: '90%'
        },
        lastMessage: {
            fontSize: normalize(18),
            color: '#989898',
            flexShrink: 1
        },
        time: {
            fontSize: normalize(18),
            color: '#989898'
        },
        profilContainer: {
            marginTop: 5,
            flex: 1,
            marginLeft: 5,
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        button: {
            width: normalize(13),
            height: normalize(13),
            marginRight: 42
        }
    })

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={source} />
            <View style={styles.profilContainer}>
                <Text style={styles.name} numberOfLines={1}>{friend.name}</Text>
                <View style={styles.lastMessageContainer}>
                    <Text style={styles.lastMessage} numberOfLines={1}>{friend.lastMessage}</Text>
                    <Text style={styles.time}> · 1sem</Text>
                </View>
            </View>
            <Image style={styles.button} source={require('../assets/icons/icons/buttonProfil.png')} />
        </View>
    )
}
