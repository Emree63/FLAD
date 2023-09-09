import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import Friend from "../components/Friend";
import normalize from '../components/Normalize';

export default function ConversationScreen() {

    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);

    const navigation = useNavigation();

    const friends = [
        { id: 1, name: "Lucas", lastMessage: "J'en ai marre de provot", source: "https://yt3.googleusercontent.com/CgPFZUSWbFj9txLG_8l48YRCwnrlfQya8sw_UCB-s3NGkQEnLj--KZI0CqSCyP2XqPfOB-j9yQ=s900-c-k-c0x00ffffff-no-rj" },
        { id: 2, name: "Louison", lastMessage: "Tu vien piscine ?", source: "https://yt3.googleusercontent.com/CgPFZUSWbFj9txLG_8l48YRCwnrlfQya8sw_UCB-s3NGkQEnLj--KZI0CqSCyP2XqPfOB-j9yQ=s900-c-k-c0x00ffffff-no-rj" },
        { id: 3, name: "Dave", lastMessage: "Ok c noté !", source: "https://img.lemde.fr/2019/04/05/0/0/960/960/664/0/75/0/18299d3_tUvp2AZPH_jnsIL2ypVFGUro.jpg" },
        { id: 4, name: "Valentin", lastMessage: "Haha react native c incroyable !!!", source: "https://yt3.googleusercontent.com/CgPFZUSWbFj9txLG_8l48YRCwnrlfQya8sw_UCB-s3NGkQEnLj--KZI0CqSCyP2XqPfOB-j9yQ=s900-c-k-c0x00ffffff-no-rj" },
    ];

    const style = isDark ? colorsDark : colorsLight;

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
                        onPress={() => navigation.navigate('Chat')}>
                        <Friend image={item.source} name={item.name} lastMessage={item.lastMessage} />
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}