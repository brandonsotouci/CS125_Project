import axios from "axios";

const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

function requireApiKey() {
  const key = process.env.LASTFM_API_KEY;
  if (!key) throw new Error("Missing LASTFM_API_KEY in backend/.env");
  return key;
}

function pickBestImage(images) {
  if (!Array.isArray(images) || images.length === 0) return undefined;
  const preferred = ["extralarge", "large", "medium", "small"];
  for (const size of preferred) {
    const found = images.find((i) => i?.size === size && i?.["#text"]);
    if (found?.["#text"]) return found["#text"];
  }
  return images[images.length - 1]?.["#text"] || undefined;
}

function toNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeTrack(t) {
  const artist =
    typeof t?.artist === "string"
      ? t.artist
      : t?.artist?.name ?? t?.artist?.["#text"] ?? "Unknown";

  return {
    name: String(t?.name ?? ""),
    artist: String(artist),
    url: t?.url ? String(t.url) : undefined,
    imageUrl: pickBestImage(t?.image),
    playcount: toNum(t?.playcount),
    listeners: toNum(t?.listeners),
  };
}

async function callLastFm(method, params) {
  const api_key = requireApiKey();
  const res = await axios.get(LASTFM_BASE_URL, {
    timeout: 12000,
    params: {
      method,
      api_key,
      format: "json",
      ...params,
    },
  });
  return res.data;
}

export async function getChartTopTracks({ limit = 20, page = 1 }) {
  const data = await callLastFm("chart.gettoptracks", { limit, page });
  const tracks = data?.tracks?.track ?? [];
  return tracks.map(normalizeTrack);
}

export async function getTopTracksByTag({ tag, limit = 20, page = 1 }) {
  const data = await callLastFm("tag.gettoptracks", { tag, limit, page });
  const tracks = data?.tracks?.track ?? [];
  return tracks.map(normalizeTrack);
}

export async function getTopTracksByArtist({ artist, limit = 20, page = 1 }) {
  const data = await callLastFm("artist.gettoptracks", { artist, limit, page });
  const tracks = data?.toptracks?.track ?? [];
  return tracks.map(normalizeTrack);
}
