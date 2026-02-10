const BACKEND_IP = process.env.EXPO_PUBLIC_COMPUTER_IP;
const BACKEND_PORT = process.env.EXPO_PUBLIC_BACKEND_PORT;

const API_BASE_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/api/lastfm`

export async function getTopTracksByGenre(
    genre: string,
) {
    const response = await fetch(`${API_BASE_URL}/genre/${genre}/tracks`)
    if(!response.ok){
        throw new Error("Failed to get tracks")
    }
    return response.json();
}

