import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false, contentStyle: {
                backgroundColor: "#1C1B34"
            }}} >
                <Stack.Screen name = "(tabs)" />
                <Stack.Screen name = "login" />
                <Stack.Screen name = "signup" /> 
            </Stack>
        </AuthProvider>
    )
}