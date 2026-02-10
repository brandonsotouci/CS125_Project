import { StyleSheet } from 'react-native';
import { Text, View, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style = {{ padding: 16 }}>
        <Text style = { { fontSize: 28, fontWeight: "bold" }}>
          Discover Page
        </Text>

    </ScrollView>
  );
}
