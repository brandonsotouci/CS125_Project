import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Slider from "@react-native-community/slider"
import { TrackMetadata } from "@/app/track/[track]";

export default function MusicPlayer({ data } : {
    data: TrackMetadata
}){
    const [isPlaying, setIsPlaying] = useState(false)
    const [position, setPosition] = useState(0)
    const duration = data.duration ? Math.floor(Number.parseInt(data.duration) / 1000) : 0

    useEffect(() => {
        if(!isPlaying){
            return
        }
        
        const playInterval = setInterval(() => {
            setPosition((prevPosition) => {
                if (prevPosition + 1 > duration) {
                    setIsPlaying(false)
                    return duration
                } else {
                    return prevPosition + 1
                }
            })
        }, 1000)

        return () => clearInterval(playInterval)
    }, [isPlaying])

    const formatTime = (sec: number) => {
        const minute = Math.floor(sec / 60)
        const seconds = sec % 60
        return `${minute}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-down" size={24} color="white" />
        <Text style={styles.headerText}>{data.album}</Text>
        <Ionicons name="settings-outline" size={22} color="white" />
      </View>

      <View style={styles.albumArt} />

      <View style={styles.info}>
        <Text style={styles.song}>{data.track}</Text>
        <Text style={styles.artist}>{data.artist.name}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.time}>{formatTime(position)}</Text>

        <Slider
          style={{ flex: 1 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#00bcd4"
          maximumTrackTintColor="#999"
          thumbTintColor="#00bcd4"
          onValueChange={(value: any) => setPosition(Math.floor(value))}
        />

        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Ionicons name="heart-outline" size={24} color="white" />
        <Ionicons name="play-skip-back" size={28} color="white" />

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="black"
          />
        </TouchableOpacity>


        <Ionicons name="play-skip-forward" size={28} color="white" />
        <Ionicons name="add-circle-outline" size={24} color="white" />
      </View>
    </View>
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1B34",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontWeight: "600",
  },
  albumArt: {
    marginTop: 20,
    height: 250,
    borderRadius: 8,
    backgroundColor: "#00bcd4",
  },
  info: {
    marginTop: 20,
  },
  song: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  artist: {
    color: "#aaa",
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  time: {
    color: "#aaa",
    fontSize: 12,
  },
  controls: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "#ddd",
    padding: 16,
    borderRadius: 50,
  },
})