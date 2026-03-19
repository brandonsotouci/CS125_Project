import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LikedSongButton from "./AddSongComponent";

export default function TrendingComponent({ tracks }: any){
    const router = useRouter();
    const TrendingTrackComponent = ({ item }: any) => {
        return (
            <View>
                <TouchableOpacity
                    style={styles.trackCard}
                    onPress={() => 
                            router.push({ pathname: "/track/[track]", params: { artist: item.artist, track: item.track } as any })
                    }
                >
                    <Image source={{ uri: item.imageUri }} style={styles.albumArt} />
                    <Text style={styles.trackName} numberOfLines={1}>{item.track}</Text>
                    <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View>
            <Text style={styles.sectionTitle}>Trending</Text>
            <FlatList
                horizontal
                data={tracks}
                renderItem={TrendingTrackComponent}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
            />
        </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
  trackCard: {
    width: 120,
    marginRight: 16,
  },
  albumArt: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  trackName: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  artistName: {
    color: "#888",
    fontSize: 12,
  },
})