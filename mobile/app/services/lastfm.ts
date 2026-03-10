import { Platform } from "react-native";
import { useAuth } from "../context/AuthContext";


const BASE: any  = `http://${process.env.EXPO_PUBLIC_COMPUTER_IP}:3000`; // Android emulator

const API = `${BASE}/api/lastfm`;

const { logout } = useAuth()

export type Track = {
  track: string;
  album: string;
  artist: string;
  url?: string;
  imageUri?: string;
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

async function getJSON<T>(url: string) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (res.status == 401){
    await logout();
    return null;
  }

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

export async function fetchChartRecommendedTracks(token: any) {
  console.log(BASE)
  const url = `${BASE}/api/postgres/recommended-tracks`;
  const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

  return res.json()
}

export async function fetchTrack(track: any, artist: any) {
  const url = `${API}/track/${track}?artist=${artist}&track=${track}`;
  const data = await getJSON<any>(url);
  return data;
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

export async function getPreferences(token: any){
    const url = `${BASE}/api/postgres/preferences/`
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return res.json()
}

export async function updatePreferences(token: any, genres: any, artists: any){
    const url = `${BASE}/api/postgres/set-preferences/`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        genres: genres,
        artists: artists
      })
    })

    return res.json()
}