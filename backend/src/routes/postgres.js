import { Router } from "express"
import { authenticateToken } from "../../middleware/auth.js";
import { pool } from "../utils/db.js";
import { getRecommendedTracks } from "../services/lastfm.service.js";
const router = Router();

router.get("/preferences", authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const result = await pool.query(
          "SELECT name, genre_id FROM user_genres ug JOIN genres g ON g.id = ug.genre_id WHERE ug.user_id = $1 ", [userId]
    );

    const artistResults = await pool.query(
        "SELECT artist FROM user_artists WHERE user_id = $1", [userId]
    )

    res.json({
        genres: result.rows,
        artists: artistResults.rows
    })
});

router.get("/liked-songs", authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const result = await pool.query(
        "SELECT * FROM user_songs us JOIN songs s ON s.id = us.song_id WHERE us.user_id = $1", [userId]
    )

    const rows = result.rows

    const data = rows.map((entry) => ({
        artist: entry.artist,
        track: entry.title
    }))

    res.json(data)
})

router.post("/set-liked-song", authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const trackData = JSON.parse(req.body["data"])

    console.log(trackData["track"])

    try {
        const result = await pool.query("SELECT * FROM user_songs us JOIN songs s ON s.id = us.song_id WHERE us.user_id = $1 AND s.title = $2", [userId, trackData.track])
        if (result.rows.length == 0){
            const song = await pool.query("SELECT * FROM songs WHERE title = $1", [trackData.track])
            console.log(song)

            let songId;
            if (song.rows.length != 0){
                songId = song.rows[0].id
            } else {
                const createdSong = await pool.query("INSERT INTO songs (title, artist, year, popularity, listeners) VALUES ($1, $2, $3, $4, $5) RETURNING id", [trackData.track, trackData.artist, 0, 0, 0]);
                console.log(createdSong)
                songId = createdSong.rows[0].id
            }

            await pool.query("INSERT INTO user_songs (user_id, song_id) VALUES ($1, $2)", [userId, songId])
            res.json({ message: "Song bookmarked!"})
        }

    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.post("/remove-liked-song", authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const trackData = JSON.parse(req.body["data"])
    console.log(trackData)
    try {
        const result = await pool.query("SELECT * FROM user_songs us JOIN songs s ON s.id = us.song_id WHERE us.user_id = $1 AND s.title = $2", [userId, trackData.track])
        if(result.rows.length !== 0){
            const songId = result.rows[0].song_id;
            await pool.query("DELETE FROM user_songs us WHERE user_id = $1 AND song_id = $2", [userId, songId])
            res.json({ message: "Removed song from preferences "})
        }

        res.json({ message: "Song not found"})
    } catch (err){
        res.status(500).json({ error: err.message})
    }
})

router.get("/albums/:query", authenticateToken, async (req, res) => {
    const query = req.params.query
    console.log(query)
    let result = await pool.query("SELECT * FROM albums WHERE title = $1", [query])
    if(result.rows.length !== 0){
        console.log(result.rows)
        res.json(result.rows)
    } else {
        res.json([])
    }
})

router.post("/set-album", authenticateToken, async (req, res) => {
    const artist = req.body["artist"]
    const name = req.body["name"]
    let result = await pool.query("SELECT * FROM albums WHERE title = $1 AND artist = $2", [name, artist])
    if(result.rows.length !== 0){
        res.status(409).json({ message: "Duplicate entry "})
    } else {
        await pool.query("INSERT INTO albums (title, artist) VALUES ($1, $2)", [name, artist])
        res.status(201).json({ message: "Album entry created "})
    }
})

router.get("/recommended-tracks", authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const tracksData = await getRecommendedTracks(userId)
    res.json(tracksData)
});

router.post("/set-preferences", authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const genres = req.body["genres"]
    const artists = req.body["artists"]

    console.log(userId, genres, artists)

    try {
        await pool.query("DELETE FROM user_genres WHERE user_id = $1", [userId])
        await pool.query("DELETE FROM user_artists WHERE user_id = $1", [userId])

        for(const genre of genres) {
            let result = await pool.query(
                "SELECT id FROM genres WHERE name = $1", [genre]
            )
        
            let genreId;
            if (result.rows.length === 0){
                const newGenre = await pool.query(
                    "INSERT INTO genres (name) VALUES ($1) RETURNING id", [genre]
                )
                genreId = newGenre.rows[0].id
            } else {
                genreId = result.rows[0].id
            }

            await pool.query(
                `INSERT INTO user_genres (user_id, genre_id, weight) VALUES ($1, $2, $3)
                ON CONFLICT DO NOTHING`, [userId, genreId, 1]
            )

        }

        for(const artist of artists){
            await pool.query(
                `INSERT INTO user_artists (user_id, artist, weight) VALUES ($1, $2, $3)
                ON CONFLICT DO NOTHING`, [userId, artist, 1]
            )
        }

        res.json({ message: "Genres and artists added successfully "})
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

export default router;