import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Charts" }} />
      <Tabs.Screen name="genres" options={{ title: "Genres" }} />
      <Tabs.Screen name="artist" options={{ title: "Artist" }} />
    </Tabs>
  );
}
