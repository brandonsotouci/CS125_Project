import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import lastfmRoutes from "./routes/lastfm.js"

const app = express();

app.use("/api/lastfm", lastfmRoutes)


app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message })
})

export default app;