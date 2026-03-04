import React from "react";
import { Image, Linking, StyleSheet, Pressable, Text, View, ViewStyle, StyleProp } from "react-native";
import type { Track } from "../app/services/lastfm";
import { useRouter } from "expo-router";

export default function TrackRow({ track }: { track: Track }) {
  const router = useRouter()
  return (
    <Pressable
      onPress={() => 
        router.push({ pathname: "/track/[track]", params: { artist: track.artist, track: track.track } as any })
      }
      style={({hovered, pressed} : {
        hovered: boolean,
        pressed: boolean
      }): StyleProp<ViewStyle> => [
        pressableStyles.component,
        pressed && pressableStyles.pressable,
        hovered && pressableStyles.pressable,
      ]}
    >
      {track.imageUri ? (
        <Image
          source={{ uri: track.imageUri }}
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
          {track.track}
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


const pressableStyles = StyleSheet.create({
    pressable: {
      backgroundColor: "lightgrey"
    },
    component: {
      flexDirection: "row",
      gap: 12,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#eee",
      alignItems: "center",
    }
})