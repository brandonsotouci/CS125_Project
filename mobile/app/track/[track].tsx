import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { fetchTrack } from "../services/lastfm";
import { useSearchParams } from "expo-router/build/hooks";
import MusicPlayer from "@/components/MusicPlayerComponent";

export interface TrackMetadata {
  track: string,
  album: string,
  artist: any,
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
    <View>
      <MusicPlayer data = {data} />
    </View>
  );
}