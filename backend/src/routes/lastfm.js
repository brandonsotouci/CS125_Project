import { Router } from "express"
import { getArtistTopTracks, getTracksByGenre, getTopGlobalTracks } from "../services/lastfm.service.js"
import { getRandomSongCover } from "../services/images.service.js";

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

export default router;
