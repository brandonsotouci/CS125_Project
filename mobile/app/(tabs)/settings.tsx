import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, TouchableOpacity, FlatList, ListRenderItem, ListRenderItemInfo } from "react-native"
import { getPreferences, updatePreferences } from '../services/lastfm'
import { useAuth } from '../context/AuthContext'

const GENRES = ["Hip-Hop", "Rock", "R&B", "Reaggaeton", "K-Pop", "Pop", "Electronic"]

export default function SettingsPage(){
    const [selectedGenres, setSelectedGenres] : any = useState([])
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

    const handlePreferences = async () => {
       const response = await updatePreferences(userToken, selectedGenres)
    }

    useEffect(() => {
        const loadPreferences = async () => {
            const response = await getPreferences(userToken)
            let loadedGenres = []
            for (let genreEntry of response.genres){
                loadedGenres.push(genreEntry.name)
            }

            setSelectedGenres(loadedGenres)
        }

        loadPreferences()
    }, [])

    return <ScrollView>
        <Text>Select Favorite Genres</Text>
        <View>
            {true && <FlatList 
                    data = {GENRES}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => {
                        console.log(item)
                        const selected = selectedGenres.includes(item)
                        return <Pressable onPress = {() => toggleGenre(item)}
                                style = {[
                                    styles.genreItem,
                                    selected && styles.selected
                                ]}>
                            <Text style={styles.genreText}>{item}</Text>
                        </Pressable>
                    }}
                />}
        </View>

        <Pressable onPress={handlePreferences} style={styles.updateButton}>
            <Text style={styles.updateText}>
                Update Preferences 
            </Text>
        </Pressable>
     
    </ScrollView>
}

const styles = StyleSheet.create({
    genreItem: {
        padding: 12,
        backgroundColor: "gray",
        width: 300,
        marginVertical: 6,
        borderRadius: 12
    },
    genreText: {
        color: "white"
    },
    selected: {
        backgroundColor: "blue"
    },
    updateButton: {
        marginTop: 20,
        backgroundColor: "#7c3aed",
        width: 250,
        padding: 12,
        borderRadius: 8,
        alignItems: "center"

    },
    updateText: {
        color: "darkblue",
        fontSize: 14,
        fontWeight: "bold"
    }
})