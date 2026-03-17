import { Redirect, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
export default function TabLayout() {
  const { userToken, loading } = useAuth();
  const router = useRouter()
  if(loading) return null;
  
  useEffect(() => {
      if(!userToken){
         router.replace("/login")
      }
  }, [])
  
  return (
    <Tabs
      screenOptions={{
        headerTitle: "Discoverfy",
        headerTintColor: "red",
      }}  
    >
      <Tabs.Screen name="index" options={
        {tabBarIcon: ({ color, size}) => ( 
            <Ionicons name = "home" size = {size} color = {color} />
        ), title: "Trending"}} 
      />
      <Tabs.Screen name="genres" options={
        {tabBarIcon: ({ color, size}) => ( 
            <Ionicons name = "musical-notes" size = {size} color = {color} />
        ), title: "Genres"}}/>
      <Tabs.Screen name="artist" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "person" size = {size} color = {color} />
      ), title: "Artist"}} />
       <Tabs.Screen name="recommendations" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "person" size = {size} color = {color} />
      ), title: "Recs"}} />
      <Tabs.Screen name="settings" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "settings" size = {size} color = {color} />
      ), title: "Settings"}} />
    </Tabs>
  );
}
