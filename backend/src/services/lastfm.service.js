import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = "https://ws.audioscrobbler.com/2.0/"
const API_KEY = process.env.LASTFM_API_KEY;


export async function getArtistTopTracks(artist){
    const response = await axios.get(baseURL, {
        params: {
            method: "artist.gettoptracks",
            artist: artist,
            api_key: API_KEY,
            format: "json",
            limit: 10
        }
    });

    return response.data.toptracks.track;
}