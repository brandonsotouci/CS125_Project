import { Redirect, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function TabLayout() {
  const { userToken, loading } = useAuth();
  const router = useRouter()

  const TAB_COLOR = "#2FEEF2"
  if(loading) return null;
  console.log(userToken)
  if (!userToken) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerTitle: "Discoverfy",
        headerTintColor: "#00FBF9",
        headerStyle: {
          backgroundColor: "#1C1B34"
        },
        tabBarStyle: {
          backgroundColor: "#1C1B34",
          gap: 2
        },
        tabBarItemStyle: {
          marginHorizontal: 1,
          padding: 0,
        },
        sceneStyle: {
          backgroundColor: "#1C1B34"
        }
      }}  
    >
      <Tabs.Screen name="index" options={
        {tabBarIcon: ({ color, size}) => ( 
            <Ionicons name = "home" size = {20} color = {TAB_COLOR} />
        ), title: "For You"}} 
      />
      <Tabs.Screen name="genres" options={
        {tabBarIcon: ({ color, size}) => ( 
            <Ionicons name = "musical-notes" color = {TAB_COLOR} />
        ), title: "Genres", href: null }}/>
      <Tabs.Screen name="artist" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "person" size = {20} color = {TAB_COLOR} />
      ), title: "Artist", href: null}} />
       <Tabs.Screen name="recommendations" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "person" size = {20} color = {TAB_COLOR} />
      ), title: "Recs",  href: null }} />
      
      <Tabs.Screen name="search" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "search" size = {20} color = {TAB_COLOR} />
      ), title: "Search"}} />
      <Tabs.Screen name="settings" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "settings" size = {20} color = {TAB_COLOR} />
      ), title: "Settings"}} />
      <Tabs.Screen name="liked" options={{ 
          tabBarIcon: ({color, size}) => (
            <Ionicons name = "heart" size = {20} color = {TAB_COLOR} />
      ), title: "Liked"}} />
    </Tabs>
  );
}
