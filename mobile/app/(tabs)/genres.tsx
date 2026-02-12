import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TrackRow from "./components/TrackRow";

import { fetchTopTracksByGenre, Track } from "../services/lastfm";

const LIMIT = 20;

export default function GenresScreen() {
  const [tag, setTag] = useState("hip-hop");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  async function loadFirst(newTag?: string) {
    const t = (newTag ?? tag).trim();
    if (!t) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetchTopTracksByGenre(t, { page: 1, limit: LIMIT });
      setTracks(res.tracks);
      setPage(1);
      setHasMore(res.tracks.length === LIMIT);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    const t = tag.trim();
    if (!t || !hasMore || loadingMore || loading) return;

    try {
      setLoadingMore(true);
      const next = page + 1;
      const res = await fetchTopTracksByGenre(t, { page: next, limit: LIMIT });
      setTracks((prev) => [...prev, ...res.tracks]);
      setPage(next);
      setHasMore(res.tracks.length === LIMIT);
    } catch {
      // ignore load-more errors
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadFirst("hip-hop");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>Genres</Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={tag}
          onChangeText={setTag}
          placeholder="hip-hop, pop, rock..."
          autoCapitalize="none"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />
        <TouchableOpacity
          onPress={() => loadFirst()}
          disabled={loading || tag.trim().length === 0}
          style={{
            paddingHorizontal: 14,
            justifyContent: "center",
            borderRadius: 10,
            backgroundColor: loading ? "#777" : "black",
          }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>
            {loading ? "..." : "Go"}
          </Text>
        </TouchableOpacity>
      </View>

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
        onRefresh={() => loadFirst()}
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
