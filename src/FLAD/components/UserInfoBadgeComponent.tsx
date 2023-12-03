import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import normalize from './Normalize';

type UserInfoProps = {
    image: string,
    date: Date,
    distance: string,
}

export default function UserInfoBadge(props: UserInfoProps) {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            height: 30,
            paddingHorizontal: normalize(10),
            backgroundColor: '#3F1DC3',
            alignSelf: 'flex-start',            
            borderRadius: 12,
            paddingRight: 20,
        },
        section: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        image: {
            width: normalize(26),
            height: normalize(26),
            borderRadius: 30,
            marginRight: normalize(10),
        },
        text: {
            fontSize: normalize(14),
            color: '#FFFFFF',
        },
        boldText: {
            fontWeight: 'bold',
        },
    });

    const date = formatDate(props.date);

    return (
        <View style={styles.container}>
            <Image source={{ uri: props.image }} style={styles.image} />
            <Text style={styles.text}>Il y a </Text>
            {date.days !== 0 ? (
                <View style={styles.section}>
                    <Text style={[styles.text, styles.boldText]}>{date.days}</Text>
                    <Text style={styles.text}>j </Text>
                </View>
            ) : date.hours !== 0 ? (
                <View style={styles.section}>
                    <Text style={[styles.text, styles.boldText]}>{date.hours}</Text>
                    <Text style={styles.text}>h </Text>
                </View>
            ) : (
                <View style={styles.section}>
                    <Text style={[styles.text, styles.boldText]}>{date.minutes}</Text>
                    <Text style={styles.text}>min</Text>
                </View>
            )}
            <Text style={styles.text}> {'<'} </Text>
            <Text style={[styles.text, styles.boldText]}>{props.distance}</Text>
            <Text style={styles.text}>m</Text>
        </View>
    );
}

const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const days = Math.floor(diffInDays);
    const hours = Math.floor(diffInHours % 24);
    const minutes = Math.floor(diffInMinutes % 60);

    return { days, hours, minutes };
};
