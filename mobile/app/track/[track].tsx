import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchTrack } from "../services/lastfm";
import { useSearchParams } from "expo-router/build/hooks";
import MusicPlayer from "@/components/MusicPlayerComponent";

export interface TrackMetadata {
  track: string,
  album: string,
  artist: any,
  published?: string,
  listeners?: string,
  playcount?: string,
  summary?: string,
  duration?: string,
  imageUri?: string
}



export default function SingleTrackPage() {
  const { track, artist } = useLocalSearchParams()
  const [data, setData] = useState<TrackMetadata | null>(null);
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null);


  /*const getYoutubeModal = async () => {
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(`${artist} ${track} official audio`)}&type=video&maxResults=1&key=${process.env.EXPO_PUBLIC_YOUTUBE_API_KEY}`
    );
  }*/

  useEffect(() => {
    const loadTrack = async () => {
      try {
        const data = await fetchTrack(track, artist)
        console.log(data)
        setData(data);
        setLoading(false);
      } catch (e: any) {
        setErr(e?.response?.data?.error ?? "Failed to load track");
      }
    }

    loadTrack()
  }, [])

  if (loading) {
    return <Text style={{ padding: 16 }}>Loading...</Text>;
  }

  return (
    <ScrollView>
      <MusicPlayer data = {data} />
      <View style = {styles.about}>
        <Text style = {styles.subtitle}>About this Song</Text>
        <Text style = {styles.text}>Album: {data?.album?? "Not Available"}</Text>
        <Text style = {styles.text}>Released: {data?.published ?? "Not Available"}</Text>
        <Text style = {styles.text}>Listeners: {data?.listeners ?? "Not Available"}</Text>
        <Text style = {styles.text}>Playcount: {data?.playcount ?? "Not Available"}</Text>
        <Text style = {styles.text}>Summary: {data?.summary ?? "Not Available"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  about: {
    display: "flex",
    flexDirection: "column",
    padding: 12,
    gap: 12
  }, 
  text: {
    color: "white"
  }, 
  subtitle: {
    color: "white",
    fontWeight: "bold"
  }
})