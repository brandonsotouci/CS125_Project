import { Redirect, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
export default function TabLayout() {
  const { userToken, loading } = useAuth();
  const router = useRouter()

  const TAB_COLOR = "#2FEEF2"
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
        headerTintColor: "#00FBF9",
        headerStyle: {
          backgroundColor: "#1C1B34"
        },
        tabBarStyle: {
          backgroundColor: "#1C1B34"
        },
        sceneStyle: {
          backgroundColor: "#1C1B34"
        }
      }}  
    >
      <Tabs.Screen name="index" options={
        {tabBarIcon: ({ color, size}) => ( 
            <Ionicons name = "home" size = {size} color = {TAB_COLOR} />
        ), title: "Trending"}} 
      />
      <Tabs.Screen name="genres" options={
        {tabBarIcon: ({ color, size}) => ( 
            <Ionicons name = "musical-notes" size = {size} color = {TAB_COLOR} />
        ), title: "Genres"}}/>
      <Tabs.Screen name="artist" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "person" size = {size} color = {TAB_COLOR} />
      ), title: "Artist"}} />
       <Tabs.Screen name="recommendations" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "person" size = {size} color = {TAB_COLOR} />
      ), title: "Recs"}} />
      <Tabs.Screen name="settings" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "settings" size = {size} color = {TAB_COLOR} />
      ), title: "Settings"}} />
    </Tabs>
  );
}
