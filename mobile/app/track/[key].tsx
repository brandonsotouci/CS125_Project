import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { api } from "../services/api";

export default function TrackDetails() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const res = await api.get(`/lastfm/track/${key}`);
        setData(res.data);
      } catch (e: any) {
        setErr(e?.response?.data?.error ?? "Failed to load track");
      }
    })();
  }, [key]);

  if (err) return <Text style={{ padding: 16 }}>{err}</Text>;
  if (!data) return <Text style={{ padding: 16 }}>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Image
        source={{ uri: data.imageUri || "https://picsum.photos/600" }}
        style={{ width: "100%", height: 280, borderRadius: 18 }}
      />
      <Text style={{ fontSize: 24, fontWeight: "800" }}>{data.track}</Text>
      <Text style={{ fontSize: 16 }}>{data.artist}</Text>

      {data.album ? <Text>Album: {data.album}</Text> : null}

      <View style={{ flexDirection: "row", gap: 16 }}>
        {data.listeners != null ? <Text>Listeners: {String(data.listeners)}</Text> : null}
        {data.playcount != null ? <Text>Plays: {String(data.playcount)}</Text> : null}
      </View>

      {data.summary ? <Text style={{ lineHeight: 20 }}>{data.summary}</Text> : null}
    </ScrollView>
  );
}