const express = require("express")
const cors = require("cors")
const helmet = require("helmet")


const app = express();


/*const userRoutes = require("./routes/user.routes")
const playlistRoutes = require("./routes/playlist.routes")


app.use(helmet());
app.use(cors());
app.use(express.json())


app.use('/api/user', userRoutes);
app.use('/api/playlists', playlistRoutes)
*/

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message })
})

module.exports = app