import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import normalize from './Normalize';

type FriendProps = {
    image: string;
    name: string;
    lastMessage: string;
}

export default function Friend(props: FriendProps) {
    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);

    const style = isDark ? colorsDark : colorsLight;

    const source = typeof props.image === 'string' ? { uri: props.image } : props.image;

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 9,
        },
        image: {
            marginLeft: "7%",
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
            color: style.Text
        },
        profilContainer: {
            marginTop: 5,
            flex: 1,
            marginLeft: 5,
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        button: {
            width: normalize(9),
            height: normalize(15),
            marginRight: 42
        }
    })

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={source} />
            <View style={styles.profilContainer}>
                <Text style={styles.name} numberOfLines={1}>{props.name}</Text>
                <View style={styles.lastMessageContainer}>
                    <Text style={styles.lastMessage} numberOfLines={1}>{props.lastMessage}</Text>
                    <Text style={styles.time}> · 1sem</Text>
                </View>
            </View>
            <Image style={styles.button} source={require('../assets/images/chevron_right_icon.png')} />
        </View>
    )
}
