import axios from "axios";
import dotenv from "dotenv"

dotenv.config()

const baseURL = "https://ws.audioscrobbler.com/2.0/"
const API_KEY = process.env.LASTFM_API_KEY;

export async function getTrackRegions(
    trackName, 
    artistName, 
    countries = [
        "United States",
        "United Kingdom",
        "Spain",
        "Canada",
        "Mexico"
    ]
){
    let globalCount = 0;
    let usCount = 0;
    const regions = []

    await Promise.all(
        countries.map(async (country) => {
            try {
                const response = await axios.get(baseURL, {
                params: {
                    method: "geo.gettoptracks",
                    country: country,
                    api_key: API_KEY, 
                    format: "json",
                    limit: 25
                }}) 

                
                const data = response.data.tracks.track
                //console.log(data)

                const found = data.find(
                    track => track.name.toLowerCase() === trackName.toLowerCase() &&
                    track.artist.name.toLowerCase() === artistName.toLowerCase()
                );

                if(found){
                    globalCount += 1
                    if(country.toLowerCase() === "united states") {
                        regions.push(country)
                    }
                }
                    
            } catch (err){
                console.error("error fetching geo top tracks: " + err.message)
            }
        })
    )

    return regions;
}