import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { colorsDark } from '../constants/colorsDark';
import { colorsLight } from '../constants/colorsLight';
import Friend from "../components/FriendComponent";
import normalize from '../components/Normalize';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConversationScreen() {

    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);

    const navigation = useNavigation();

    const friends = [
        { id: 1, name: "Lucas", lastMessage: "J'en ai marre de provot", source: "https://i1.sndcdn.com/artworks-ncJnbnDbNOFd-0-t500x500.jpg" },
        { id: 2, name: "Louison", lastMessage: "Tu vien piscine ?", source: "https://i1.sndcdn.com/artworks-ncJnbnDbNOFd-0-t500x500.jpg" },
        { id: 3, name: "Dave", lastMessage: "Ok c noté !", source: "https://img.lemde.fr/2019/04/05/0/0/960/960/664/0/75/0/18299d3_tUvp2AZPH_jnsIL2ypVFGUro.jpg" },
        { id: 4, name: "Valentin", lastMessage: "Haha react native c incroyable !!!", source: "https://i1.sndcdn.com/artworks-ncJnbnDbNOFd-0-t500x500.jpg" },
    ];

    const style = isDark ? colorsDark : colorsLight;

    const insets = useSafeAreaInsets();

    const styles = StyleSheet.create({
        mainSafeArea: {
            flex: 1,
            backgroundColor: style.body,
            paddingTop: insets.top
        },
        titleContainer: {
            marginTop: 10,
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
            marginBottom: 5
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