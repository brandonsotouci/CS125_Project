import { useState } from "react"
import { View, TextInput, Button, Alert, StyleSheet, Text, Pressable } from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const signup = async () => {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_COMPUTER_IP}:${process.env.EXPO_PUBLIC_BACKEND_PORT}/signup`, {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify({ email, password })
        })

        if (res.ok) {
            Alert.alert("Account Created!")
            router.replace('/login');
        } else {
            Alert.alert("Signup Failed!")
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.component}>
                <Text style={styles.title}>Create Account</Text>
                <TextInput 
                    placeholder="Email" 
                    style={styles.input}
                    onChangeText = {setEmail} 
                    value = {email}
                />
                <TextInput 
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry 
                    onChangeText={setPassword}
                    value = {password} 
                />
                <Pressable
                    style={styles.button}
                    onPress={signup} 
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>

                <Pressable onPress = {() => router.push("/login")} >
                    <Text style={styles.link}>Already have an account? Login</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0D0D0D"

    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        color: "white",
        marginBottom: 24
    },
    component: {
        alignSelf: "center",
        padding: 24,
        borderRadius: 12
    },
    input: {
        backgroundColor: "#242424",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 16,
        color: "white",
    },
    button: {
        backgroundColor: "green",
        alignItems: "center",
        borderRadius: 8, 
        paddingVertical: 12,
        marginBottom: 8
    },
    buttonText: {
         color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    link: {
        color: "lightblue", 
        textAlign: "center",
        fontSize: 14
    }
})