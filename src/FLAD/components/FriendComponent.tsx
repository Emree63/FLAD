import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import normalize from './Normalize';
import Message from '../models/Message';

type FriendProps = {
    image: string;
    name: string;
    lastMessage: Message;
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

    const getTimeDifferenceString = (date: Date): string => {
        const now = new Date();
        const differenceInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const intervals = {
            an: 31536000,
            mois: 2592000,
            sem: 604800,
            jour: 86400,
            heure: 3600,
            min: 60,
        };

        for (const [intervalName, seconds] of Object.entries(intervals)) {
            const intervalCount = Math.floor(differenceInSeconds / seconds);
            if (intervalCount > 0) {
                if (intervalName === 'mois' || intervalName === 'min') {
                    return `il y a ${intervalCount} ${intervalName}`;
                } else {
                    return `il y a ${intervalCount} ${intervalName}${intervalCount !== 1 ? 's' : ''}`;
                }
            }
        }

        return 'À l’instant';
    };

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={source} />
            <View style={styles.profilContainer}>
                <Text style={styles.name} numberOfLines={1}>{props.name}</Text>
                <View style={styles.lastMessageContainer}>
                    <Text style={styles.lastMessage} numberOfLines={1}>{props.lastMessage.content}</Text>
                    <Text style={styles.time}> · {getTimeDifferenceString(props.lastMessage.date)}</Text>
                </View>
            </View>
            <Image style={styles.button} source={require('../assets/images/chevron_right_icon.png')} />
        </View>
    )
}
