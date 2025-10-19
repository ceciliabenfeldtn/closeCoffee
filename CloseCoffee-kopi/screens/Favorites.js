// anton
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, favorites, form, layout, shadows, text } from '../styles/styles';

export default function FavoritesScreen() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [nameInput, setNameInput] = useState('');

  const addFavorite = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

setFavoritesList((current) => [...current, trimmedName]);
    setNameInput('');
  };

const removeFavorite = (name) => {
  setFavoritesList((current) => current.filter((fav) => fav !== name));
};

  const renderFavorite = ({ item }) => (
  <View style={layout.card}>
    <Text style={text.h3}>{item}</Text>
    <TouchableOpacity style={form.button} onPress={() => removeFavorite(item)}>
      <Text style={form.buttonText}>Delete</Text>
    </TouchableOpacity>
  </View>
);

  return (
    <View style={layout.screen}>
      <View style={[layout.card, shadows.subtle, favorites.inputCard]}>
        <Text style={text.h2}>Note your favorite coffee bars</Text>
        <TextInput
          style={[form.input, favorites.nameInput]}
          placeholder="Coffee bar name"
          placeholderTextColor={colors.placeholderText}
          value={nameInput}
          onChangeText={setNameInput}
        />
        <TouchableOpacity style={form.button} onPress={addFavorite}>
          <Text style={form.buttonText}>Save to favorites</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={favoritesList}
        keyExtractor={(item) => item}
        renderItem={renderFavorite}
        contentContainerStyle={layout.listContent}
        ListEmptyComponent={
          <Text style={[text.body, favorites.placeholder]}>
            You haven't saved any favorite coffee bars yet.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="dark" />
    </View>
  );
}