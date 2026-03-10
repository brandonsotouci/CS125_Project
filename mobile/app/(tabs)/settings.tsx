import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, TouchableOpacity, FlatList, ListRenderItem, ListRenderItemInfo, ScrollViewBase } from "react-native"
import { getPreferences, updatePreferences } from '../services/lastfm'
import { useAuth } from '../context/AuthContext'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { relative } from 'path'

const GENRES = ["Hip-Hop", "Rock", "R&B", "Reaggaeton", "K-Pop", "Pop", "Electronic"]

export default function SettingsPage(){
    const [selectedGenres, setSelectedGenres] : any = useState([])
    const [artistInput, setArtistInput]: any = useState("")
    const [artists, setArtists] : any = useState([])
    const [message, setMessage] = useState("")
    const { userToken } = useAuth()

    const toggleGenre = (selected: any) => {
        if (selectedGenres.includes(selected)){
            const newGenreArray = selectedGenres.filter(item => item !== selected)
            setSelectedGenres(newGenreArray)
        } else {
            setSelectedGenres([...selectedGenres, selected])
        }
    }

    const addArtist = () => {
        if(artistInput && !artists.includes(artistInput)){
            setArtists([...artists, artistInput])
            setArtistInput("")
        }
    }

    const removeArtist = (artist: any) => {
        if(artists.includes(artist)){
            const newArtistArray = artists.filter(item => item !== artist)
            setArtists(newArtistArray)
        }
    }

    const handlePreferences = async () => {
        try {
            const response = await updatePreferences(userToken, selectedGenres, artists)
            setMessage("Preferences Updated!")
        } catch (err: any){
            setMessage(err.message)
        } finally {
            setTimeout(() => {
                setMessage("")
            }, 2000)
        }
       
    }

    useEffect(() => {
        const loadPreferences = async () => {
            const response = await getPreferences(userToken)
            let loadedGenres = []
            let loadedArtists = []

            for (let genreEntry of response.genres){
                loadedGenres.push(genreEntry.name)
            }

            setSelectedGenres(loadedGenres)

            for (let artistEntry of response.artists){
                loadedArtists.push(artistEntry.artist)
            }

            setArtists(loadedArtists)
        }

        loadPreferences()
    }, [])

    return <SafeAreaView style = {{flex: 1}} >
        <ScrollView contentContainerStyle = {styles.container}>
        {message && <Text style={styles.messageText}>{message}</Text>}
        <Text style = {styles.title}>Select Favorite Genres</Text>
             <FlatList 
                    data = {GENRES}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => {
                        const selected = selectedGenres.includes(item)
                        return <Pressable onPress = {() => toggleGenre(item)}
                                style = {[
                                    styles.genreItem,
                                    selected && styles.selected
                                ]}>
                            <Text style={styles.genreText}>{item}</Text>
                        </Pressable>
                    }}
            />


        <Text style = {styles.artistTitle}>Select Favorite Artists</Text>
        <View style = {styles.inputContainer}>
            <TextInput placeholder="Add artist..."
                style={styles.inputBox}
                value={artistInput}
                onChangeText={setArtistInput}
            ></TextInput>
            <Pressable style = {styles.addButton} onPress={addArtist}>
                <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
        </View>
        <FlatList 
            data={artists}
            keyExtractor={(item) =>item}
            renderItem={({item}) => (
                <View style={styles.artistItem}>
                    <Text style={styles.artistText}>{item}</Text>
                    <Pressable style = {styles.removeArtistItem} onPress = {() => removeArtist(item)}>
                        <Text>X</Text>
                    </Pressable>
                </View>
            )} 
        />
        <Pressable onPress={handlePreferences} style={styles.updateButton}>
            <Text style={styles.updateText}>
                Update Preferences 
            </Text>
        </Pressable>
    </ScrollView>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        alignItems: "center",
        height: 1000
    },
    messageText: {
        color: "red"
    },
    title: {
        fontSize: 18,
        marginVertical: 12
    },
    artistTitle: {
        fontSize: 18,
        marginVertical: 24
    },
    genreItem: {
        padding: 12,
        backgroundColor: "#F3F4Ff",
        width: 250,
        marginVertical: 12,
        borderRadius: 12
    },
    genreText: {
        color: "black"
    },
    selected: {
        backgroundColor: "#f54263"
    },
    updateButton: {
        marginTop: 20,
        backgroundColor: "#000",
        width: 250,
        padding: 12,
        borderRadius: 8,
        alignItems: "center"

    },
    updateText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold"
    },
    inputContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 12,
    },
    inputBox: {
        backgroundColor: "black",
        color: "#FFF",
        width: 200,
        padding: 12,
        paddingLeft: 16,
        borderRadius: 12,
        position: "relative"
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    addButtonText: {
        color: "white"
    },
    artistItem: {
        padding: 12,
        backgroundColor: "#f54263",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: 200,
        marginVertical: 12,
        borderRadius: 12,
        position: "relative"
    },
    removeArtistItem: {
        position: "absolute",
        right: 20
    },
    artistText: {
        color: "white"
    }
})