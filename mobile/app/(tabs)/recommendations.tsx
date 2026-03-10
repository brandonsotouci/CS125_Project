import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from "react-native";
import TrackRow from "../../components/TrackRow";
import { fetchChartRecommendedTracks, fetchChartTopTracks, Track } from "../services/lastfm";
import { useAuth } from "../context/AuthContext";

const LIMIT = 20;

export default function RecommendationPage(){
  const [tracks, setTracks] = useState<Track[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userToken } = useAuth()

  async function loadFirst() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchChartRecommendedTracks(userToken);
      console.log(res)
      setTracks(res);
      setPage(1);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFirst();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, paddingTop: 2, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>Recommendation Based on Your Favorite Genres!</Text>

      {error ? <Text style={{ color: "crimson" }}>{error}</Text> : null}
      {loading ? <ActivityIndicator /> : null}

      <FlatList
        data={tracks}
        keyExtractor={(t, i) => `${t.artist}-${t.track}-${i}`}
        renderItem={({ item }) => <TrackRow track={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        onEndReachedThreshold={0.6}
        refreshing={loading}
        onRefresh={loadFirst}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
