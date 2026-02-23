import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
export default function TabLayout() {
  const { userToken, loading } = useAuth();

  if (loading) 
    return null;

  if (!userToken) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerTitle: "Discoverfy",
        headerTintColor: "red",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trending",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="genres"
        options={{
          title: "Genres",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="artist"
        options={{
          title: "Artist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}