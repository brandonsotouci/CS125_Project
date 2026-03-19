import { useAuth } from "@/app/context/AuthContext";
import { deleteLikedSong, setLikedSong } from "@/app/services/lastfm";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";

export default function LikedSongButton({ song, initialLiked = false, size = 32, handleOnClick = null} : any) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const { userToken } = useAuth()
 
  const handlePress = async () => {
    if(handleOnClick != null){
      handleOnClick(song)
    }

    if (loading) return;
    const next = !liked;
    setLiked(next); // optimistic update
    setLoading(true);
    try {
      await (next ? setLikedSong(userToken as string, song) : deleteLikedSong(userToken as string, song));
    } catch (err) {
      console.error(err);
      setLiked(!next); // rollback on failure
    } finally {
      setLoading(false);
    }
  };
 
  return (
      
    <TouchableOpacity
      onPress={(e) => {
        e.stopPropagation();
        handlePress();
      }}
      disabled={loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={liked ? "Unlike song" : "Like song"}
      accessibilityState={{ checked: liked, busy: loading }}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        liked ? styles.liked : styles.unliked,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={liked ? "#1D9E75" : "#999"} />
      ) : liked ? (
        <CheckIcon size={size * 0.44} />
      ) : (
        <PlusIcon size={size * 0.44} />
      )}
    </TouchableOpacity>
  )
}
 
function PlusIcon({ size }: any) {
  const t = size * 0.11;
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.bar, { top: (size - t) / 2, left: 0, width: size, height: t, borderRadius: t / 2, backgroundColor: "#999" }]} />
      <View style={[styles.bar, { left: (size - t) / 2, top: 0, width: t, height: size, borderRadius: t / 2, backgroundColor: "#999" }]} />
    </View>
  );
}
 
function CheckIcon({ size } : any) {
  const t = size * 0.11;
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.bar, { width: size * 0.42, height: t, borderRadius: t / 2, backgroundColor: "#1D9E75", bottom: size * 0.28, left: size * 0.04, transform: [{ rotate: "45deg" }] }]} />
      <View style={[styles.bar, { width: size * 0.68, height: t, borderRadius: t / 2, backgroundColor: "#1D9E75", bottom: size * 0.38, left: size * 0.26, transform: [{ rotate: "-50deg" }] }]} />
    </View>
  );
}
 
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  unliked: {
    borderColor: "rgba(0,0,0,0.18)",
    backgroundColor: "transparent",
  },
  liked: {
    borderColor: "#1D9E75",
    backgroundColor: "#E1F5EE",
  },
  bar: {
    position: "absolute",
  },
});