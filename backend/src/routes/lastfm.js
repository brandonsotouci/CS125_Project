import { Router } from "express"
import { getArtistTopTracks, getTracksByGenre, getTopGlobalTracks } from "../services/lastfm.service.js"
import { getRandomSongCover } from "../services/images.service.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getSongCoverBySeed } from "../services/images.service.js";
import { makeTrackKey, encodeTrackKey, splitTrackKey } from "/utils/trackKey.js";

const router = Router();

function stripHtml(s = "") {
  return s.replace(/<[^>]*>/g, "").trim();
}

router.get("/top-tracks", async (req, res) => {
  try {
    const tracks = await getTopGlobalTracks();
    const updatedTracks = tracks.map((t) => {
      const artist = t.artist?.name ?? t.artist ?? "";
      const track = t.name ?? t.track ?? "";
      const rawKey = makeTrackKey(artist, track);
      const key = encodeTrackKey(rawKey);
      return {
        key,
        track,
        artist,
        playcount: t.playcount,
        listeners: t.listeners,
        imageUri: getSongCoverBySeed(key, 120, 120),
      };
    });

    return res.json(updatedTracks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch top global tracks" });
  }
});

router.get("/genre/:tag/tracks", async (req, res) => {
  const tag = decodeURIComponent(req.params.tag);

  try {
    const tracks = await getTracksByGenre(tag);

    const updatedTracks = tracks.map((t) => {
      const artist = t.artist.name;
      const track = t.name;
      const rawKey = makeTrackKey(artist, track);
      const key = encodeTrackKey(rawKey);

      return {
        key, 
        track,
        artist,
        playcount: t.playcount,
        listeners: t.listeners,
        imageUri: getSongCoverBySeed(key, 120, 120),
      };
    });
    res.json(updatedTracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch genre tracks" });
  }
});

router.get("/artist/:artist/tracks", async (req, res) => {
  try {
    const artistParam = decodeURIComponent(req.params.artist);
    const tracks = await getArtistTopTracks(artistParam);

    const updatedTracks = tracks.map((t) => {
      const artist = t.artist.name;
      const track = t.name;
      const rawKey = makeTrackKey(artist, track);
      const key = encodeTrackKey(rawKey);
      return {
        key,
        track,
        artist,
        playcount: t.playcount,
        listeners: t.listeners,
        imageUri: getSongCoverBySeed(key, 120, 120),
      };
    });

    res.json(updatedTracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch artist tracks" });
  }
});

/**
 * ✅ BACKEND “SINGLE PAGE” ENDPOINT
 * Only logged-in users can access it (requireAuth).
 * Frontend calls /api/lastfm/track/:key
 */
router.get("/track/:key", requireAuth, async (req, res) => {
  try {
    const { artist, track } = splitTrackKey(req.params.key);
    const info = await getTrackInfo(artist, track);
    const images = info?.album?.image || info?.image || [];
    const lastfmImage =
      images.find((i) => i.size === "extralarge")?.["#text"] ||
      images.find((i) => i.size === "large")?.["#text"] ||
      images.find((i) => i.size === "medium")?.["#text"] ||
      "";

    res.json({
      key: req.params.key,
      track: info?.name || track,
      artist: info?.artist?.name || artist,
      album: info?.album?.title || "",
      listeners: info?.listeners ?? null,
      playcount: info?.playcount ?? null,
      url: info?.url || "",
      summary: info?.wiki?.summary ? stripHtml(info.wiki.summary) : "",
      imageUri: lastfmImage || getSongCoverBySeed(req.params.key, 600, 600),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        error: "Failed to fetch track info" 
    });
  }
});

export default router;