import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "Discoverfy",
        headerTintColor: "red"
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
    </Tabs>
  );
}
