import { createContext, useContext, useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native";

type AuthContextType = {
    userToken: string | null;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

async function saveToken(token: string){
    if(Platform.OS === "web") {
        localStorage.setItem("token", token)
    } else {
        await SecureStore.setItemAsync("token", token)
    }
}

async function getToken(){
    if(Platform.OS === "web"){
        return localStorage.getItem("token")
    } else {
        return await SecureStore.getItemAsync("token")
    }
}

async function deleteToken() {
    if(Platform.OS === "web"){
        localStorage.removeItem("token")
    } else {
        await SecureStore.deleteItemAsync("token")
    }
}

export function AuthProvider({ children }: {
    children: React.ReactNode
}) {
    const [userToken, setUserToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadToken = async () => {
            const token = await getToken()
            setUserToken(token)
            setLoading(false);
        }
        loadToken()
    }, []);

    const login = async (token: string) => {
        await saveToken(token)
        setUserToken(token)
    }

    const logout = async () => {
        await deleteToken()
        setUserToken(null)
    }

    return (
        <AuthContext.Provider value = {{userToken, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

