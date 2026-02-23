import axios from "axios"
const baseURL = "https://picsum.photos/";

export function getSongCoverBySeed(seed, width = 300, height = 300) {
  return `${baseURL}seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

/*  KEEP THE BOTTOM CODE FOR POTENTIAL FUTURE USE 
    ISSUE IS RATE LIMITING
*/

//const baseURL = "https://www.theaudiodb.com/api/v1/json/123/searchtrack.php"
/*export async function getImageByArtistAndTrack(artist, track){
    var data = await callAudioDBAPIWithEncodingFlag(artist, track, true);
    if(data == null){
        data = await callAudioDBAPIWithEncodingFlag(artist, track, false);
    } 

    if(data == null){
        return null;
    }

    const imageUri = data[0].strTrackThumb;
    if(imageUri != null){
        return imageUri;
    }

    return null;
}

async function callAudioDBAPIWithEncodingFlag(artist, track, encoded = false){
    const response = await axios.get(baseURL, {
        params: {
            s: encoded ? encodeURIComponent(artist.trim()) : artist.trim(),
            t: encoded ? encodeURIComponent(track.trim()) : track.trim(),
        }
    })

    return response.data.track
}*/