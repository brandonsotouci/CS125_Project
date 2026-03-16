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