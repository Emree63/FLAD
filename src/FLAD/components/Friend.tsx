import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { GraphicalCharterDark } from '../assets/GraphicalCharterDark';
import { GraphicalCharterLight } from '../assets/GraphicalCharterLight';
import normalize from './Normalize';

type UserProps = {
    image: string;
    name: string;
    lastMessage: string;
}


export default function Friend() {
    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);

    const style = isDark ? GraphicalCharterDark : GraphicalCharterLight;

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 9,
        },
        image: {
            marginLeft: 15,
            marginRight: 7,
            width: 50,
            height: 50
        },
        name: {
            fontWeight: 'bold',
            color: style.Text,
            fontSize: normalize(22)
        }
    })

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/RedFlady.png")} />
            <Text style={styles.name} >Emre KARTAL</Text>
        </View>
    )
}
