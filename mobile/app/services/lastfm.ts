const API_BASE_URL = "http://localhost:3000/api/lastfm"

export async function getTopTracksByGenre(
    genre: string,
) {
    const response = await fetch(`${API_BASE_URL}/genre/${genre}/tracks`)
    if(!response.ok){
        throw new Error("Failed to get tracks")
    }
    return response.json();
}

