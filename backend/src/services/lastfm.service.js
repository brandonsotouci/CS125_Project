import axios from "axios";
import dotenv from "dotenv";
import { calculateTrackRankingScore } from "../utils/rankingTrackScore.js";
import { getTrackRegions } from "../utils/geoPresenceCounts.js";
import { getRandomSongCover } from "./images.service.js";
import { pool } from "../utils/db.js";
dotenv.config();

const baseURL = "https://ws.audioscrobbler.com/2.0/"
const API_KEY = process.env.LASTFM_API_KEY;

export async function getRecommendedTracks(userId){
    const result = await pool.query(
        "SELECT name FROM user_genres ug JOIN genres g ON g.id = ug.genre_id WHERE ug.user_id = $1", [userId]
    )

    const artistEntries = await pool.query(
        "SELECT artist FROM user_artists WHERE user_id = $1", [userId]
    )

    const genres = result.rows
    const artists = artistEntries.rows
    const genreResults = []
    const artistResults = []
    const topTracksData = []

    for (let genre of genres){
        try {
            let genreResult = await getTracksByGenre(genre.name, Math.floor(10 / genres.length))
            genreResults.push(...genreResult)
        } catch (err){
            continue
        }
    }  

    for(let artist of artists){
        try {
            let artistResult = await getArtistTopTracks(artist.artist, Math.floor(10 / artists.length))
            artistResults.push(...artistResult)
        } catch (err) {
            continue
        }
    }   

    
    for(let i = 0; i < Math.min(genreResults.length, 10); i++){
        //let randomIndex = Math.floor(Math.random() * genreResults.length)
        //let element = genreResults.splice(randomIndex, 1)[0]
        let element = genreResults[i]
        topTracksData.push(element)
    }


    for(let i = 0; i < Math.min(artistResults.length, 10); i++){
        //let randomIndex = Math.floor(Math.random() * artistResults.length)
        //let element = artistResults.splice(randomIndex, 1)[0]
        let element = artistResults[i]
        topTracksData.push(element)
    }
    
    const enrichedData = await Promise.all(
        topTracksData.map(async (track) => {
            /*const metadata = await axios.get(baseURL, {
                params: {
                    method: "track.getInfo",
                    artist: encodeURIComponent(track.artist.name),
                    track: encodeURIComponent(track.name),
                    api_key: API_KEY,
                    format: "json"
                }
            })*/

            //const trackInfo = metadata.data.track;
            const rankingScore = calculateTrackRankingScore({
                playcount: parseInt(track.playcount) || 0,
                listeners: parseInt(track?.listeners) || 0,
                rank: track['@attr']?.rank ? parseInt(track['@attr'].rank) : 0,
                rankChange: 0, //for now,
                chartPresenceCount: 1 //for now
            })

            const imageUri = await getRandomSongCover(); //getImageByArtistAndTrack(track.artist.name, track.name);
            return {
                artist: track.artist.name,
                duration: track.duration,
                playcount: track.playcount ?? null,
                track: track.name,
                album: track.album?.name ?? null,
                rankingScore: rankingScore,
                imageUri: imageUri
            }
        })
    )

    enrichedData.sort(() => Math.random() - 0.5)
    return enrichedData;
}


export async function getTopGlobalTracks(){
    const response = await axios.get(baseURL, {
        params: {
            method: "chart.gettoptracks",
            api_key: API_KEY,
            format: "json",
        }
    })

    const topTracksData = response.data.tracks.track
    const enrichedData = await Promise.all(
        topTracksData.map(async (track) => {
            const metadata = await axios.get(baseURL, {
                params: {
                    method: "track.getInfo",
                    artist: encodeURIComponent(track.artist.name),
                    track: encodeURIComponent(track.name),
                    api_key: API_KEY,
                    format: "json"
                }
            })

            const trackInfo = metadata.data.track;
            const rankingScore = calculateTrackRankingScore({
                playcount: parseInt(trackInfo.playcount) || 0,
                listeners: parseInt(trackInfo.listeners) || 0,
                rank: track['@attr']?.rank ? parseInt(track['@attr'].rank) : 0,
                rankChange: 0, //for now,
                chartPresenceCount: 1 //for now
            })

            const regions = await getTrackRegions(
                track.name,
                track.artist.name
            )

            //console.log(geoScore)
            const imageUri = await getRandomSongCover(); //getImageByArtistAndTrack(track.artist.name, track.name);
            //console.log(imageUri)
            
            return {
                artist: track.artist.name,
                listeners: trackInfo.listeners,
                duration: track.duration,
                playcount: track.playcount ?? null,
                track: track.name,
                album: trackInfo.album?.title ?? null,
                genres: trackInfo.toptags?.tag?.map((genre) => genre.name) ?? [],
                releaseDate: trackInfo.wiki?.published ?? null,
                rankingScore: rankingScore,
                regions: regions,
                imageUri: imageUri
            }
        })
    )
    //console.log(enrichedData)

    return enrichedData;
}

export async function getTracksByGenre(tag, limit = 50){
    if(!tag){
        console.log("TAG MISSING?");
        throw new Error("Genre tag paramater is required!")
    }

    try {
        const response = await axios.get(baseURL, {
            params: {
                method: "tag.gettoptracks",
                tag,
                api_key: API_KEY,
                format: "json",
                limit: limit,
            }
        })
        return response.data.tracks.track;

    } catch (err) {
        return null;
    }  
}

export async function getArtistTopTracks(artist, limit = 10){
    try {
        const response = await axios.get(baseURL, {
            params: {
                method: "artist.gettoptracks",
                artist: artist,
                api_key: API_KEY,
                format: "json",
                limit: limit
            }
        });

        return response.data.toptracks.track;

    } catch (err) {
        return null;
    }

}

export async function getTrackInfo(artist, track) {
    try {
        const response = await axios.get(baseURL, {
            params: {
                method: "track.getInfo",
                api_key: API_KEY,
                format: "json",
                artist,
                track,
            },
        });

        return response.data.track;
    } catch (err) {
        return null;
    }

}

export async function getTrackByTitleOnly(title, limit = 20){
    try {
        const response = await axios.get(baseURL, {
            params: {
                method: "track.search",
                api_key: API_KEY,
                format: "json",
                track: title,
            }
        })

        if (response?.data.length !== 0) {
            return response?.data?.results?.trackmatches?.track
        }
    } catch (err) {
        return null;
    }

    return null;
}