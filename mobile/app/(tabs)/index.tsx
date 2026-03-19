import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchChartRecommendedTracks, fetchChartTopTracks, getChartTopTracks, Track } from "../services/lastfm";
import { useAuth } from "../context/AuthContext";

import RecommendationComponent from "@/components/RecommendationComponent";
import TrendingComponent from "@/components/TrendingComponent";
import { ExpoSkeleton } from "@/components/ExpoSkeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LikedSongsHomeComponent from "@/components/LikedSongsComponent";

const LIMIT = 20;

export default function HomePage(){
  const [recommendedTracks, setRecommendedTracks] = useState([])
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([])
  const [loading, setIsLoading] = useState(true)
  const { userToken } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
        const recommendationData = await fetchChartRecommendedTracks(userToken);
        setRecommendedTracks(recommendationData)
        let trendingTracksCache = await AsyncStorage.getItem("TRENDING_TRACKS")
        if(!trendingTracksCache) {
          const trendingData = await getChartTopTracks({ page: 1, limit: LIMIT })
          setTrendingTracks(trendingData)
          AsyncStorage.setItem("TRENDING_TRACKS", JSON.stringify(trendingData))
        } else {
          setTrendingTracks(JSON.parse(trendingTracksCache))
        }

        setIsLoading(false)
    }

    fetchData()
  }, [])


  
  return <View style = {styles.container}>
      {!loading ? <View style = {styles.subcontainer}>
          <RecommendationComponent tracks = {recommendedTracks} /> 
          <TrendingComponent tracks = {trendingTracks} />
          <LikedSongsHomeComponent />
        </View> : 
          <View style = {styles.loadingRows}>
              {Array.from({ length: 10 }).map((_, i) => <ExpoSkeleton width={400} height = {100} /> )}
          </View>
       }
  </View>
  
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    color: "white",
    width: 400,
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    marginTop: 0
  },
  subcontainer: {
    gap: 24,
    display: "flex",
    flexDirection: "column",

  },
  text: {
    color: "white"
  },
  loadingRows: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
})