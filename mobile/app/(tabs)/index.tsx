import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getTopTracksByGenre }  from '../services/lastfm'

export default function HomeScreen(){
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTracks = async (genre: any) => {
    try {
      const data = await getTopTracksByGenre(genre);
      setTracks(data.data)
      console.log("GOT TRACKS");
    } catch (err){
      console.error(err);
      return;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("useEffect")
    const genre = "HipHop";
    loadTracks(genre)
  }, [])


  if(loading){
    return ( 
    <View style={styles.center}>
      <Text style = {{color: "white"}}>Loading...</Text>
    </View>)
  }

  return (
    <View style={styles.center}>
        <Text style={{color: "white"}}>
          Top Tracks
        </Text>
    </View>
  )
}


const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "black"
  }
})