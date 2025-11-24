// Favorites.js
// anton

import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  colors,
  favorites as favoritesStyles,
  form,
  layout,
  shadows,
  text,
} from "../styles/styles";
import { auth, userFavoritesRef } from "../firebase/database";
import { onValue, set, remove, child } from "firebase/database";

export default function FavoritesScreen() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [nameInput, setNameInput] = useState("");

  // Load favorites for the currently logged-in user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const favRef = userFavoritesRef(user.uid);

    const unsubscribe = onValue(favRef, (snap) => {
      const data = snap.val() || {};
      // { coffeecollective: true, democratic: true }
      setFavoritesList(Object.keys(data));
    });

    return () => unsubscribe();
  }, []);

  const addFavorite = async () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        "Ikke logget ind",
        "Du skal være logget ind for at gemme favoritter."
      );
      return;
    }

    try {
      // users/<uid>/favorites/<trimmedName> = true
      const favRef = child(userFavoritesRef(user.uid), trimmedName);
      await set(favRef, true);
      setNameInput("");
    } catch (e) {
      console.error("Add favorite error", e);
      Alert.alert("Fejl", "Kunne ikke gemme favoritten.");
    }
  };

  const removeFavorite = async (name) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const favRef = child(userFavoritesRef(user.uid), name);
      await remove(favRef);
    } catch (e) {
      console.error("Remove favorite error", e);
    }
  };

  const renderFavorite = ({ item }) => (
  <View style={[favoritesStyles.item, shadows.subtle, { 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }]}>
    <Text style={text.body}>{item}</Text>

    <TouchableOpacity onPress={() => removeFavorite(item)}>
      <Text
        style={{
          marginLeft: 8,
          fontWeight: "600",
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 6,
          borderWidth: 1,
        }}
      >
        Fjern
      </Text>
    </TouchableOpacity>
  </View>
);

  return (
    <View style={layout.screen}>
      <View style={layout.content}>
        <Text style={text.h1}>Favoritter</Text>

        <TextInput
          style={[form.input, { marginTop: 16 }]}
          placeholder="Tilføj favorit kaffebar"
          value={nameInput}
          onChangeText={setNameInput}
        />

        <TouchableOpacity
          style={[form.button, { marginTop: 8 }]}
          onPress={addFavorite}
        >
          <Text style={form.buttonText}>Gem favorit</Text>
        </TouchableOpacity>

        <FlatList
          style={{ marginTop: 16 }}
          data={favoritesList}
          keyExtractor={(item) => item}
          renderItem={renderFavorite}
          contentContainerStyle={layout.listContent}
          ListEmptyComponent={
            <Text style={[text.body, favoritesStyles.placeholder]}>
              Du har ikke gemt nogen favoritter endnu.
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <StatusBar style="dark" />
    </View>
  );
}