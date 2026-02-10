import { Router } from "express"
import { getArtistTopTracks, getTracksByGenre, getTopGlobalTracks } from "../services/lastfm.service.js"

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
        res.json(
            tracks.map(track => ({
                name: track.name,
                artist: track.artist.name,
                playcount: track.playcount,
                listeners: track.listeners
            }))
        )
    } catch (err){
        console.error(err);
        res.status(500).json({error: "Failed to fetch genre tracks"})
    }
})

router.get("/artist/:artist/tracks", async (req, res) => {
    try {
        const artist = decodeURIComponent(req.params.artist)
        const tracks = await getArtistTopTracks(artist)
        console.log(tracks)
        res.json(
            tracks.map(track => ({
                name: track.name,
                playcount: track.playcount,
                listeners: track.listeners
            }))
        )
    } catch (err){
        console.error(err);
        res.status(500).json({error: "Failed to fetch artist tracks"})
    }
})

export default router;