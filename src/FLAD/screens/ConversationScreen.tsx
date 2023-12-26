import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { LightTheme, DarkTheme, Theme } from "../constants/colors";
import Friend from "../components/FriendComponent";
import normalize from '../components/Normalize';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getConversations } from "../redux/thunk/chatThunk";

export default function ConversationScreen() {

    //@ts-ignore
    const friends = useSelector(state => state.appReducer.conversations);
    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        // @ts-ignore
        dispatch(getConversations());
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        //@ts-ignore
        dispatch(getConversations());
        setTimeout(() => {
            setRefreshing(false);
        }, 700);
    };

    const navigation = useNavigation();

    const style: Theme = isDark ? DarkTheme : LightTheme;

    const insets = useSafeAreaInsets();

    const styles = StyleSheet.create({
        mainSafeArea: {
            flex: 1,
            backgroundColor: style.body,
            paddingTop: insets.top
        },
        titleContainer: {
            marginLeft: "7%",
        },
        title: {
            fontSize: normalize(28),
            fontWeight: 'bold',
            color: style.Text,
        },
        description: {
            marginTop: 3,
            fontSize: normalize(20),
            color: '#787878',
            marginBottom: 5
        },
        body: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginHorizontal: "7%"
        },
        text: {
            color: style.Text,
            fontSize: normalize(18),
            opacity: 0.8,
            textAlign: 'center'
        }
    })

    return (
        <View style={styles.mainSafeArea}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Messages</Text>
                <Text style={styles.description}>Retrouvez ici les discussions</Text>
            </View>
            {friends.length === 0 ? (
                <View style={styles.body}>
                    <Text style={styles.text}>
                        Pas de conversations pour le moment. 🥲{'\n'}
                        Va liker des musiques pour créer des conversations avec des gens dans le monde ! 🔥🎆
                    </Text>
                </View>
            ) : (
                <FlatList
                    style={{ marginTop: 10 }}
                    data={friends.sort((a: any, b: any) => b.lastMessage.date - a.lastMessage.date)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        // @ts-ignore
                        <TouchableOpacity onPress={() => navigation.navigate('Chat', { username: item.name, image: item.image, conversation: item.id })}>
                            <Friend image={item.image} name={item.name} lastMessage={item.lastMessage} />
                        </TouchableOpacity>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={style.Text}
                        />
                    }
                />
            )}
        </View>
    )
}