import { SearchComponentProps } from "@/app/(tabs)/search";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const MasterSearchBar = ({ searchInput, onChangeInput, placeholder} : SearchComponentProps) => {
  const theme = useTheme();
  const inputRef = React.useRef<TextInput | null>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  
  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      color: theme.colors.text,
    },
    isFocused && styles.inputFocused
  ];

  const handleClear = () => {
    onChangeInput('');
    inputRef.current?.focus();
  };

   return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={inputStyle}
        placeholder={placeholder || 'Search for genres...'}
        placeholderTextColor={theme.colors.text}
        value={searchInput}
        onChangeText={onChangeInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none"
        returnKeyType="search"
        selectionColor={theme.colors.primary}
        underlineColorAndroid="transparent"
      />
      
      {searchInput && (
        <TouchableOpacity
          style={styles.clearButton}
          activeOpacity={0.7}
          onPress={handleClear}
        >
          <Text style={styles.clearText}>x</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    padding: 0,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: '#3A87FF',
    backgroundColor: '#fff',
    shadowColor: '#3A87FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  clearButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
  },
});

export default MasterSearchBar;