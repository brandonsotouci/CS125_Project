import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface GenreTabEntry {
  id: string,
  name: string
}

const GENRES: GenreTabEntry[] = [
  { id: '1', name: 'Rock' },
  { id: '2', name: 'Pop' },
  { id: '3', name: 'Jazz' },
  { id: '4', name: 'Hip Hop' },
  { id: '5', name: 'Electronic' },
  { id: '6', name: 'Classical' },
  { id: '7', name: 'Country' },
  { id: '8', name: 'Reggae' },
  { id: '9', name: 'Blues' },
  { id: '10', name: 'Soul' },
];

const COLORS = [
  '#FF5252', '#FFEB3B', '#00BCD4', '#009688', '#66BB6A',
  '#E91E63', '#2196F3', '#FF9800', '#9C27B0', '#3F51B5'
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};


const GenreGridComponent = ({ setQueryInput } : any) => {
  const handleOnPress = (key: string) => {
    setQueryInput(key)
  }

  const GenreTab = ({ genreEntry }: { genreEntry: GenreTabEntry }) => {
    return <Pressable style = {[
            styles.genreItem, { backgroundColor: getRandomColor() }
        ]} onPress={() => handleOnPress(genreEntry.name)}>
        <Text style = {styles.genreName}>{genreEntry.name}</Text>
    </Pressable>
  }

  return <View style = {styles.container}>
      <Text style = {styles.headerTitle}>Choose From Genres</Text>
      <FlatList
      data={GENRES}
      renderItem={({ item }) => (
        <GenreTab genreEntry={item} />
      )}
      keyExtractor={item => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.contentContainer}
    />
   </View>
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: 300,
    margin: "auto",
    marginVertical: 0,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "medium",
    marginVertical: 4,
    textAlign: "left"
  },
  genreItem: {
    borderRadius: 8,
    width: 140,
    height: 50,
    padding: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: "white"
  },
  columnWrapper: {
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default GenreGridComponent;
