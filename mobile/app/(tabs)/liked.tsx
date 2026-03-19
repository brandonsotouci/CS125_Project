import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import LikedSongButton from "@/components/AddSongComponent";
import { getLikedSongs } from "../services/lastfm";
import { useAuth } from "../context/AuthContext";


export default function LikedSongsPage() {
  const [songs, setSongs] : any = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userToken } = useAuth()

  const handleOnClick = (song: any) => {
    console.log(song)
    setSongs((prev: any) => songs.filter((item: any) => item.artist !== song.artist && item.track !== song.track))
  }

  useEffect(() => {
    const getSongs = async () => {
        const songs = await getLikedSongs(userToken as string)
        setSongs(songs)
        setLoading(false)
    }

    getSongs()
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (songs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No liked songs yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Liked Songs</Text>

      {songs.map((song: any, index: any) => (
        <View key={index} style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{song.track}</Text>
            <Text style={styles.artist} numberOfLines={1}>{song.artist}</Text>
          </View>

          <LikedSongButton song={song} initialLiked={true} handleOnClick = {handleOnClick}/>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "white",
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
    color: "#888",
  },
  errorText: {
    fontSize: 14,
    color: "#E24B4A",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },
});