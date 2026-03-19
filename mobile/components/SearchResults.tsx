import { useRouter } from "expo-router";
import { FlatList, Pressable, ScrollView, ScrollViewBase, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LikedSongButton from "./AddSongComponent";

interface SearchResultsProps {
  searchQuery: string;
  loading: boolean;
  results: any[];
  onItemPress?: (item: any) => void;
  emptyStateText?: string;
  error?: string;
}

const router = useRouter()

const AlbumTab = ({item, onItemPress} : any) => {
   return  <TouchableOpacity 
              style={styles.resultItem}
              onPress={() => onItemPress?.(item)}>
                <Text style={styles.resultText}>{item.title || 'Unknown Title'}</Text>
                {item.artist && (<Text style={styles.resultSubtitle}>Album - {item.artist}</Text>)}
          </TouchableOpacity> 
}

const TrackTab = ({item, onItemPress} : any) => {
   return  <Pressable 
              style={styles.resultItem}
              onPress={() => 
                  router.push({ pathname: "/track/[track]", params: { artist: item.artist, track: item.track } as any })
              }>
                
                  <Text style={styles.resultText}>{item.track || 'Untitled'}</Text>
                  {item.artist && (<Text style={styles.resultSubtitle}>Song - {item.artist}</Text>)}
                  <View style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }} onStartShouldSetResponder={() => true} ><LikedSongButton song = {item} initialLiked={item.liked}/></View>
          </Pressable> 

}

const SearchResults = ({ 
  searchQuery, 
  loading, 
  results, 
  onItemPress,
  emptyStateText = "No results found",
  error
}: SearchResultsProps) => {
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style = {styles.container}>
      {loading ? (
       <Text style = {styles.smallHeaderText}>Loading...</Text>
      ) : results.length > 0 ? (
        <View style={styles.resultsList}>
          <Text style = {styles.smallHeaderText}>Results for {searchQuery}</Text>
          {results.map((item, index) => (
            <View
              key={index} 
            >
              {item.type === "song" ? <TrackTab item = {item} onItemPress = {onItemPress} /> : <AlbumTab item = {item} onItemPress={onItemPress}/>}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {emptyStateText}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  smallHeaderText: {
    paddingHorizontal: 16,
    fontWeight: "bold",
    color: "white"
  },
  skeletonContainer: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  skeletonItem: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  resultsList: {
    marginTop: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: "relative"
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#AAA',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#fff0f0',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
});

export default SearchResults;
