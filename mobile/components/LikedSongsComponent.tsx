import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

export default function LikedSongsHomeComponent(){
    const router = useRouter()
    const handlePress = () => {
        router.push("/liked")
    }

    return <Pressable onPress={handlePress} style = {styles.container}>
            <Text style={styles.text}>Liked Songs</Text>
        </Pressable>
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        display: "flex",
        height: 100,
        width: 300,
        alignItems: "center",
        backgroundColor: "rgba(0, 255, 253, 1)",
        justifyContent: "center",
        borderRadius: 8,
        alignSelf: "center"
    },
    text: {
        color: "black",
        fontWeight: "bold"
    }
})