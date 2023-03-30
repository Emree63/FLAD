import { SafeAreaView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { GraphicalCharterDark } from '../assets/GraphicalCharterDark';
import { GraphicalCharterLight } from '../assets/GraphicalCharterLight';

export default function ConversationList() {

    // @ts-ignore
    const isDark = useSelector(state => state.userReducer.dark);

    const style = isDark ? GraphicalCharterDark : GraphicalCharterLight;

    const styles = StyleSheet.create({
        mainSafeArea: {
            flex: 1,
            backgroundColor: style.body,
        }
    )

    return (
        <SafeAreaView style={styles.mainSafeArea}>

            
        </SafeAreaView>
    )
}