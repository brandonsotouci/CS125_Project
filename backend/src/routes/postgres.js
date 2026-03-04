import { Router } from "express"
import { authenticateToken } from "../../middleware/auth.js";
import { pool } from "../utils/db.js";
const router = Router();

router.get("/preferences", authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const result = await pool.query(
          "SELECT g.name, ug.genre_id FROM user_genres ug, genres g WHERE ug.user_id = $1", [userId]
    );

    console.log(result.rows)
    res.json({
        genres: result.rows
    })
})

router.post("/set-preferences", authenticateToken, async (req, res) => {
    const userId = req.user.userId
    const genres = req.body["genres"]

    console.log(userId, genres)

    try {
        const deleteRes = await pool.query("DELETE FROM user_genres WHERE user_id = $1", [userId])

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

        res.json({ message: "Genres added successfully "})
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

export default router;