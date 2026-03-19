import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecommendationComponent({ tracks } : any){
    const router = useRouter()
    const TrackComponent = ({item} : any) => {
        console.log(item)
        return <TouchableOpacity
                    style={styles.trackCard}
                    onPress={() => 
                        router.push({ pathname: "/track/[track]", params: { artist: item.artist, track: item.track } as any })
                    }
                >
                    <Image source={{ uri: item.imageUri }} style={styles.albumArt} width = {50} height = {50} />
                    <Text style={styles.trackName} numberOfLines={1}>{item.track}</Text>
                    <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
            </TouchableOpacity>
    }

    return (
        <View>
            <View style = {styles.titleSection}>
                <Text style={styles.sectionTitle}>Recommended for you</Text>
                <Text style ={styles.rightCharacter}>&gt;</Text>
            </View>
            <FlatList
                horizontal
                data={tracks}
                renderItem={TrackComponent}
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
    marginVertical: 16
  },
  titleSection: {
     position: "relative",
     display: "flex",
     flexDirection: "row",
     alignItems: "center",
     height: 40,
     marginBottom: 6
  },
  rightCharacter: {
    position: "absolute",
    right: 0,
    color: "white",
    fontWeight: "bold",
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
    textAlign: "left"
  },
  artistName: {
    color: "#888",
    fontSize: 12,
  },
})