import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from "react-native";
import TrackRow from "./components/TrackRow";
import { fetchChartTopTracks, Track } from "../services/lastfm";

const LIMIT = 20;

export default function ChartsScreen() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  async function loadFirst() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchChartTopTracks({ page: 1, limit: LIMIT });
      setTracks(res.tracks);
      setPage(1);
      setHasMore(res.tracks.length === LIMIT);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!hasMore || loadingMore || loading) return;
    try {
      setLoadingMore(true);
      const next = page + 1;
      const res = await fetchChartTopTracks({ page: next, limit: LIMIT });
      setTracks((prev) => [...prev, ...res.tracks]);
      setPage(next);
      setHasMore(res.tracks.length === LIMIT);
    } catch {
      // silently ignore load-more errors
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadFirst();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>Global Charts</Text>

      {error ? <Text style={{ color: "crimson" }}>{error}</Text> : null}
      {loading ? <ActivityIndicator /> : null}

      <FlatList
        data={tracks}
        keyExtractor={(t, i) => `${t.artist}-${t.name}-${i}`}
        renderItem={({ item }) => <TrackRow track={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        onEndReached={loadMore}
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
