import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { Track } from "../app/services/lastfm";

export default function TrackRow({ track }: { track: Track }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/track/[key]", params: { key: track.key } })
      }
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
      }}
    >
      <Image
        source={{ uri: track.imageUri }}
        style={{ width: 56, height: 56, borderRadius: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "800" }}>{track.track}</Text>
        <Text>{track.artist}</Text>
        <Text style={{ opacity: 0.7 }}>
          {track.listeners} listeners • {track.playcount} plays
        </Text>
      </View>
    </Pressable>
  );
}