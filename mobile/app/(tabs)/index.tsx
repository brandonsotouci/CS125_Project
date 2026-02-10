import { Text, View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { getTopTracksByGenre }  from '../services/lastfm'

type TrackProps = {
  name: string,
  artist: string,
}

export default function HomeScreen(){
  const [tracks, setTracks] = useState<TrackProps[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTracks = async (genre: any) => {
    try {
      const data = await getTopTracksByGenre(genre);
      setTracks(data)
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
        <FlatList 
          data = {tracks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ ({item}) => (
            <View style={styles.songComponent}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
          )}
        />    
    </View>
  )
}


const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "black"
  },
  songComponent: {
    marginTop: 12,
    marginBottom: 12
  },
  artist:{
    color: "green",
    fontWeight: "bold"
  },
  text: {
    color: "white"
  }
})