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
import { fetchTopTracksByArtist, Track } from "../services/lastfm";

const LIMIT = 20;

export default function ArtistScreen() {
  const [artist, setArtist] = useState("Kanye West");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  async function loadFirst(newArtist?: string) {
    const a = (newArtist ?? artist).trim();
    if (!a) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetchTopTracksByArtist(a, { page: 1, limit: LIMIT });
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
    const a = artist.trim();
    if (!a || !hasMore || loadingMore || loading) return;

    try {
      setLoadingMore(true);
      const next = page + 1;
      const res = await fetchTopTracksByArtist(a, { page: next, limit: LIMIT });
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
    loadFirst("Kanye West");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>Artist</Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={artist}
          onChangeText={setArtist}
          placeholder="Artist name..."
          autoCapitalize="words"
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
          disabled={loading || artist.trim().length === 0}
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
