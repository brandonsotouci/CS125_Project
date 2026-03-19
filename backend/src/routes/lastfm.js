import { Router } from "express"
import { getArtistTopTracks, getTracksByGenre, getTopGlobalTracks, getTrackInfo, getRecommendedTracks, getTrackByTitleOnly } from "../services/lastfm.service.js"
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

router.get("/song/:song", async (req, res) => {
    try {
        const song = req.params.song
        const tracks = await getTrackByTitleOnly(song)
        if (tracks != null){
            const parsedTracks = tracks.map((track) => {
                const metadata = getTrackInfo(track.artist, track.name)
                return ({
                    track: track?.name,
                    artist: track?.artist,
                    album: metadata.album?.title || "",
                    listeners: track?.listeners,
                    mbid: track?.mbid

                })})

            //console.log(parsedTracks)
            res.json(parsedTracks)

        } else {
            res.json({})
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: err.messsage
        })
    }
})

function cleanHtml(raw) {
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
}

function removeTaggedContent(raw) {
  return raw
    .replace(/<[^>]+>.*?<\/[^>]+>/gis, '')
    .replace(/<[^>]+\/?>/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
}

router.get("/track/:track", async (req, res) => {
  try {
    //console.log(req.query)
    const title = encodeURIComponent(req.params.track)
    const artist = req.query.artist
    //console.log(title, artist)

    //console.log(artist, title)
    const track = await getTrackInfo(artist, title);
    console.log(track)
    const imageUri = await getRandomSongCover()

    res.json({
      track: track.name,
      artist: track.artist || artist,
      album: track.album?.title || "",
      listeners: track?.listeners ?? null,
      playcount: track?.playcount ?? null,
      duration: track?.duration ?? null,
      imageUri: imageUri,
      published: track.wiki?.published ?? null,
      summary: track.wiki?.summary ? removeTaggedContent(track.wiki.summary) : "",
      url: track?.url ?? null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        error: "Failed to fetch track info" 
    });
  }
});

export default router;
