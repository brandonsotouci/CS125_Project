import { Router } from "express"
import { getArtistTopTracks } from "../services/lastfm.service.js"

const router = Router();

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