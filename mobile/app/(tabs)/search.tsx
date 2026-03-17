import GenreGridComponent from "@/components/GenreComponents";
import MasterSearchBar from "@/components/MasterSearchBar";
import SearchResults from "@/components/SearchResults";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { smartGetDataFromQuery } from "../services/lastfm";

export interface SearchComponentProps {
    searchInput: string;
    onChangeInput: (text: string) => void;
    placeholder?: string;
}

export default function MasterSearchScreen() {
    const [searchInput, setSearchInput] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await smartGetDataFromQuery(searchInput)
            console.log(response)
            setItems(response)
            setLoading(false)
        }

        if(searchInput.trim().length != 0) {
            fetchData()
        }
    }, [searchInput])

    return (
        <ScrollView style = {styles.strictContainer}>
            <MasterSearchBar searchInput = {searchInput} onChangeInput = {setSearchInput} placeholder={"Search song, artist, album, ..."} />
            {!searchInput && <GenreGridComponent setQueryInput = {setSearchInput}/>}
            {searchInput && <SearchResults searchQuery = {searchInput} results={items} loading={loading} onItemPress={setItems} />}
         </ScrollView>
    );
}

const styles = StyleSheet.create({
    strictContainer: {
        width: 350,
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        marginTop: 0
    }
})