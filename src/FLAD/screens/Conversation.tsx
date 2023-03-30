import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { GraphicalCharterDark } from '../assets/GraphicalCharterDark';
import { GraphicalCharterLight } from '../assets/GraphicalCharterLight';
import Friend from "../components/Friend";
import normalize from '../components/Normalize';

export default function ConversationList() {

    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);

    const friends = [
        { id: 1, name: "Lucas", lastMessage: "J'en ai marre de provot", source: require('../assets/images/jul.png') },
        { id: 2, name: "Louison", lastMessage: "Tu vien piscine ?", source: require('../assets/images/jul.png') },
        { id: 3, name: "Dave", lastMessage: "Ok c noté !", source: require('../assets/images/pnl.png') },
        { id: 4, name: "Valentin", lastMessage: "Haha react native c incroyable !!!", source: require('../assets/images/jul.png') },
    ];

    const style = isDark ? GraphicalCharterDark : GraphicalCharterLight;

    const styles = StyleSheet.create({
        mainSafeArea: {
            flex: 1,
            backgroundColor: style.body,
        },
        titleContainer: {
            marginTop: 30,
            marginLeft: 20,
        },
        title: {
            fontSize: normalize(28),
            fontWeight: 'bold',
            color: style.Text,
        },
        description: {
            marginTop: 10,
            fontSize: normalize(20),
            color: '#787878',
            marginBottom: 20
        }
    })

    return (
        <SafeAreaView style={styles.mainSafeArea}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Messages</Text>
                <Text style={styles.description}>Retrouvez ici tous vos amis!</Text>
            </View>
            <FlatList
                style={{ marginTop: 10 }}
                data={friends}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        // @ts-ignore
                        onPress={() => navigation.navigate('Message')}>
                        <Friend image={item.source} name={item.name} lastMessage={item.lastMessage} />
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}