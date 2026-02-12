import { Platform } from "react-native";

const DEFAULT_BASE =
  Platform.OS === "web" || Platform.OS === "ios"
    ? "http://localhost:3000"
    : "http://10.0.2.2:3000"; // Android emulator

const BASE = (process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, "");
const API = `${BASE}/api/lastfm`;

export type Track = {
  name: string;
  artist: string;
  url?: string;
  imageUrl?: string;
  playcount?: number;
  listeners?: number;
};

export type PagedTracksResponse = {
  page: number;
  limit: number;
  tracks: Track[];
  tag?: string;
  artistQuery?: string;
};

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
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

  const url = `${API}/artist/${encodeURIComponent(artist)}/top-tracks?page=${page}&limit=${limit}`;
  const data = await getJSON<any>(url);
  return normalizePaged(data, { page, limit }, { artistQuery: artist });
}

export async function fetchChartTopTracks(
  opts?: { page?: number; limit?: number }
): Promise<PagedTracksResponse> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;

  const url = `${API}/chart/top-tracks?page=${page}&limit=${limit}`;
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
