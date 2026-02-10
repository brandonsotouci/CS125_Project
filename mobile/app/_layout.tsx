import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"

export default function RootLayout() {
  return (
    <Tabs screenOptions = {{
      headerShown: false,
      tabBarActiveTintColor: '#1DB954'
    }}>

      <Tabs.Screen
        name = "(tabs)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name = "home" color = {color} size = {size} />
          )
        }}
        
      />
    </Tabs>
  )

}
