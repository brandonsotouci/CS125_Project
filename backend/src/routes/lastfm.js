import { Router } from "express"
import { getArtistTopTracks, getTracksByGenre, getTopGlobalTracks, getTrackInfo, getRecommendedTracks } from "../services/lastfm.service.js"
import { getRandomSongCover } from "../services/images.service.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = Router();

router.get("/top-tracks", async (req, res) => {
    try {
        const tracksData = await getTopGlobalTracks()
        return res.json(tracksData)
    } catch (err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch top global tracks"})
    }

})

router.get("/genre/:tag/tracks", async (req, res) => {
    const tag = decodeURIComponent(req.params.tag)
    try {
        const tracks = await getTracksByGenre(tag);
        const updatedTracks = await Promise.all(
            tracks.map(async (track) => ({
                track: track.name,
                artist: track.artist.name,
                playcount: track.playcount,
                listeners: track.listeners,
                imageUri: await getRandomSongCover(),
            }))
        )

        res.json(updatedTracks);
    } catch (err){
        console.error(err);
        res.status(500).json({error: "Failed to fetch genre tracks"})
    }
})

router.get("/artist/:artist/tracks", async (req, res) => {
    try {
        const artist = decodeURIComponent(req.params.artist)
        const tracks = await getArtistTopTracks(artist)
        const updatedTracks = await Promise.all(
            tracks.map(async (track) => ({
                track: track.name,
                artist: track.artist.name,
                playcount: track.playcount,
                listeners: track.listeners,
                imageUri: await getRandomSongCover()
            }))
        )

        res.json(updatedTracks)
    
    } catch (err){
        console.error(err);
        res.status(500).json({error: "Failed to fetch artist tracks"})
    }
})

router.get("/track/:track", async (req, res) => {
  try {
    //console.log(req.query)
    const title = req.params.track
    const artist = req.query.artist

    //console.log(artist, title)
    const track = await getTrackInfo(artist, title);
    const imageUri = await getRandomSongCover()
    res.json({
      track: track.name,
      artist: track.artist || artist,
      album: track.album?.title || "",
      listeners: track?.listeners ?? null,
      playcount: track?.playcount ?? null,
      imageUri: imageUri,
      summary: imageUri?.wiki?.summary ? stripHtml(info.wiki.summary) : "",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        error: "Failed to fetch track info" 
    });
  }
});

export default router;
