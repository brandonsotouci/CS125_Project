import axios from "axios";
import dotenv from "dotenv";
import { calculateTrackRankingScore } from "../utils/rankingTrackScore.js";
import { getTrackRegions } from "../utils/geoPresenceCounts.js";
import { getRandomSongCover } from "./images.service.js";
dotenv.config();

const baseURL = "https://ws.audioscrobbler.com/2.0/"
const API_KEY = process.env.LASTFM_API_KEY;

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
