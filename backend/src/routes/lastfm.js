import express from "express";
import {
  getChartTopTracks,
  getTopTracksByTag,
  getTopTracksByArtist,
} from "../services/lastfm.service.js";

const router = express.Router();

function parseLimitPage(req) {
  const limitRaw = req.query.limit ?? "20";
  const pageRaw = req.query.page ?? "1";

  const limit = Math.max(1, Math.min(100, parseInt(limitRaw, 10) || 20));
  const page = Math.max(1, parseInt(pageRaw, 10) || 1);

  return { limit, page };
}

// GET /api/lastfm/chart/top-tracks?limit=20&page=1
router.get("/chart/top-tracks", async (req, res, next) => {
  try {
    const { limit, page } = parseLimitPage(req);
    const tracks = await getChartTopTracks({ limit, page });
    res.json({ page, limit, tracks });
  } catch (err) {
    next(err);
  }
});

// GET /api/lastfm/genre/:tag/tracks?limit=20&page=1
router.get("/genre/:tag/tracks", async (req, res, next) => {
  try {
    const tag = req.params.tag;
    const { limit, page } = parseLimitPage(req);
    const tracks = await getTopTracksByTag({ tag, limit, page });
    res.json({ tag, page, limit, tracks });
  } catch (err) {
    next(err);
  }
});

// GET /api/lastfm/artist/:artist/top-tracks?limit=20&page=1
router.get("/artist/:artist/top-tracks", async (req, res, next) => {
  try {
    const artist = req.params.artist;
    const { limit, page } = parseLimitPage(req);
    const tracks = await getTopTracksByArtist({ artist, limit, page });
    res.json({ artist, page, limit, tracks });
  } catch (err) {
    next(err);
  }
});

export default router;
