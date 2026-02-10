import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = "https://ws.audioscrobbler.com/2.0/"
const API_KEY = process.env.LASTFM_API_KEY;

export async function getTracksByGenre(tag){
    if(!tag){
        console.log("TAG MISSING?");
        throw new Error("Genre tag paramater is required!")
    }

    const response = await axios.get(baseURL, {
        params: {
            method: "tag.gettoptracks",
            tag,
            api_key: API_KEY,
            format: "json",
            limit: 50,
        }
    })


    return response.data.tracks.track;
}

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