import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";


  Platform.OS === "web"
  ? "http://localhost:3000"
  : Platform.OS === "android"
  ? "http://10.0.2.2:3000"
  : "http://localhost:3000";

const BASE = (process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, "");
const API = `${BASE}/api/lastfm`;

async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === "web") return localStorage.getItem("token");
  return await SecureStore.getItemAsync("token");
}

export type Track = {
  key: string;
  track: string;
  artist: string;
  playcount: string;
  listeners: string;
  imageUri: string;
};

export type PagedTracksResponse = {
  page: number;
  limit: number;
  tracks: Track[];
  tag?: string;
  artistQuery?: string;
};

async function getJSON<T>(url: string): Promise<T> {
  const token = await getStoredToken();
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

/** backend might return either Track[] OR { tracks: Track[], page, limit } */
function normalizePaged(
  data: any,
  fallback: { page: number; limit: number },
  extras?: Partial<PagedTracksResponse>
): PagedTracksResponse {
  const tracks = Array.isArray(data) ? data : data?.tracks;
  return {
    page: Number(data?.page) || fallback.page,
    limit: Number(data?.limit) || fallback.limit,
    tracks: Array.isArray(tracks) ? tracks.filter(Boolean) : [],
    ...extras,
  };
}

// --------------------- FETCH (returns {tracks,page,limit}) ---------------------

export async function fetchTopTracksByGenre(
  genre: string,
  opts?: { page?: number; limit?: number }
): Promise<PagedTracksResponse> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;

  const url = `${API}/genre/${encodeURIComponent(genre)}/tracks?page=${page}&limit=${limit}`;
  const data = await getJSON<any>(url);
  return normalizePaged(data, { page, limit }, { tag: genre });
}

export async function fetchTopTracksByArtist(
  artist: string,
  opts?: { page?: number; limit?: number }
): Promise<PagedTracksResponse> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;

  const url = `${API}/artist/${encodeURIComponent(artist)}/tracks?page=${page}&limit=${limit}`;
  const data = await getJSON<any>(url);
  return normalizePaged(data, { page, limit }, { artistQuery: artist });
}

export async function fetchChartTopTracks(
  opts?: { page?: number; limit?: number }
): Promise<PagedTracksResponse> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;

  const url = `${API}/top-tracks?page=${page}&limit=${limit}`;
  const data = await getJSON<any>(url);
  return normalizePaged(data, { page, limit });
}

// --------------------- GET (returns Track[]) ---------------------

export async function getTopTracksByGenre(
  genre: string,
  opts?: { page?: number; limit?: number }
): Promise<Track[]> {
  const res = await fetchTopTracksByGenre(genre, opts);
  return res.tracks;
}

export async function getTopTracksByArtist(
  artist: string,
  opts?: { page?: number; limit?: number }
): Promise<Track[]> {
  const res = await fetchTopTracksByArtist(artist, opts);
  return res.tracks;
}

export async function getChartTopTracks(
  opts?: { page?: number; limit?: number }
): Promise<Track[]> {
  const res = await fetchChartTopTracks(opts);
  return res.tracks;
}

// BACKEND SINGLE PAGE
export type TrackDetails = {
  key: string;
  track: string;
  artist: string;
  album?: string;
  listeners?: string | number | null;
  playcount?: string | number | null;
  imageUri: string;
  summary?: string;
  url?: string;
};

export async function fetchTrackDetails(key: string): Promise<TrackDetails> {
  const url = `${API}/track/${encodeURIComponent(key)}`;
  return getJSON<TrackDetails>(url);
}