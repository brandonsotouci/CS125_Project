import { useState } from "react"
import { View, TextInput, Button, StyleSheet, Text } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { useAuth } from "./context/AuthContext"

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()

    const handleLogin = async () => {
        setErrorMessage(null)
        setLoading(true)

        if(!email || !password){
            setErrorMessage("Please enter both email and password!");
            return;
        }

        try {
            const res = await fetch(`http://${process.env.EXPO_PUBLIC_COMPUTER_IP}:${process.env.EXPO_PUBLIC_BACKEND_PORT}/login`, {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage("Invalid credentials!")
            } else {
                await login(data.token)
                router.replace("/(tabs)")
            }

        } catch (err: any){
            setErrorMessage(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style = {styles.component}>
                <Text style = {styles.title}>Login</Text>
                <TextInput style = {styles.input} placeholder="Email" onChangeText = {setEmail} />
                <TextInput style = {styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                <Button disabled = {loading} title = "Login" onPress={handleLogin} />
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
    },
    errorText: {
        color: "red"
    }
})