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
const SESSION_DURATION = 60 * 60 * 1000;


async function saveToken(token: string){
    const session = {
        user: token,
        expiresAt: Date.now() + SESSION_DURATION,
    };

    if(Platform.OS === "web") {
        localStorage.setItem("session", JSON.stringify(session))
    } else {
        await SecureStore.setItemAsync("session", JSON.stringify(session))
    }
}

async function getToken(){
    let session;
    if(Platform.OS === "web"){
        session = localStorage.getItem("session")
    } else {
        session = await SecureStore.getItemAsync("session")
    }

    if(!session) return;

    const sessionData = JSON.parse(session as string);
    const isExpired = Date.now() > sessionData.expiresAt;
    
    if (isExpired) {
        deleteToken()
    }

    return sessionData
}

async function deleteToken() {
    if(Platform.OS === "web"){
        localStorage.removeItem("session")
    } else {
        await SecureStore.deleteItemAsync("session")
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
            if(token){
                setUserToken(token.user)
            }
            setLoading(false);
        }

        loadToken()
    }, [])
    
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

