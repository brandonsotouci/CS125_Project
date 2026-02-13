import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import type { Track } from "../../services/lastfm";

export default function TrackRow({ track }: { track: Track }) {
  const onPress = async () => {
    if (!track) 
      return null;
    if (track.url) {
      try {
        await Linking.openURL(track.url);
      } catch {
        // ignore
      }
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        alignItems: "center",
      }}
    >
      {track.imageUrl ? (
        <Image
          source={{ uri: track.imageUrl }}
          style={{ width: 56, height: 56, borderRadius: 10 }}
        />
      ) : (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 10,
            backgroundColor: "#eee",
          }}
        />
      )}

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "800" }} numberOfLines={1}>
          {track.name}
        </Text>
        <Text style={{ color: "#666" }} numberOfLines={1}>
          {track.artist}
        </Text>
        <Text style={{ color: "#999", marginTop: 2 }} numberOfLines={1}>
          {track.playcount ? `Plays: ${track.playcount}` : ""}
          {track.playcount && track.listeners ? " • " : ""}
          {track.listeners ? `Listeners: ${track.listeners}` : ""}
        </Text>
      </View>
    </Pressable>
  );
}
