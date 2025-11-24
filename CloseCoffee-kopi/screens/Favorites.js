// Favorites.js
// anton

import { useEffect, useMemo, useState } from "react";
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
import { auth, cafesRef, userFavoritesRef } from "../firebase/database";
import { onValue, get, set, remove, child } from "firebase/database";

export default function FavoritesScreen() {
  const [search, setSearch] = useState("");
  const [cafes, setCafes] = useState([]);            // all cafes from DB
  const [favoriteIds, setFavoriteIds] = useState([]); // ids of favorites (cafeId)
  const [loadingCafes, setLoadingCafes] = useState(true);

  // Load all cafes once
  useEffect(() => {
    const loadCafes = async () => {
      try {
        const snap = await get(cafesRef());
        const data = snap.val() || {};
        const list = Object.entries(data).map(([id, c]) => ({
          id,
          name: c?.name ?? "Ukendt",
          address: c?.address ?? "",
        }));
        setCafes(list);
      } catch (e) {
        console.error("Error loading cafes for favorites", e);
        Alert.alert("Fejl", "Kunne ikke hente kaffebarer.");
      } finally {
        setLoadingCafes(false);
      }
    };

    loadCafes();
  }, []);

  // Load favorites for the currently logged-in user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const favRef = userFavoritesRef(user.uid);

    const unsubscribe = onValue(favRef, (snap) => {
      const data = snap.val() || {};
      // data: { coffeecollective: true, democratic: true }
      setFavoriteIds(Object.keys(data));
    });

    return () => unsubscribe();
  }, []);

  // Derived: favorites with full details (name + address)
  const favoriteCafes = useMemo(() => {
    if (!cafes.length) return [];
    return favoriteIds
      .map((id) => {
        const found = cafes.find((c) => c.id === id);
        if (found) return found;
        // fallback if cafe removed from DB
        return { id, name: id, address: "" };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [favoriteIds, cafes]);

  // Filter cafes based on search text
  const filteredCafes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cafes;
    return cafes.filter((c) => {
      const name = c.name?.toLowerCase() ?? "";
      const addr = c.address?.toLowerCase() ?? "";
      return name.includes(q) || addr.includes(q);
    });
  }, [search, cafes]);

  const addFavorite = async (cafe) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        "Ikke logget ind",
        "Du skal være logget ind for at gemme favoritter."
      );
      return;
    }

    try {
      // users/<uid>/favorites/<cafe.id> = true
      const favRef = child(userFavoritesRef(user.uid), cafe.id);
      await set(favRef, true);
    } catch (e) {
      console.error("Add favorite error", e);
      Alert.alert("Fejl", "Kunne ikke gemme favoritten.");
    }
  };

  const removeFavorite = async (cafeId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const favRef = child(userFavoritesRef(user.uid), cafeId);
      await remove(favRef);
    } catch (e) {
      console.error("Remove favorite error", e);
    }
  };

  const renderCafeResult = ({ item }) => {
    const isFavorite = favoriteIds.includes(item.id);
    return (
      <View
        style={[
          favoritesStyles.item,
          shadows.subtle,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          {/* name: darker & bolder */}
          <Text
            style={[
              text.body,
              { color: colors.primaryText, fontWeight: "700" },
            ]}
          >
            {item.name}
          </Text>
          {!!item.address && (
            <Text style={[text.small, { color: colors.secondaryText }]}>
              {item.address}
            </Text>
          )}
        </View>

        <TouchableOpacity
          disabled={isFavorite}
          onPress={() => addFavorite(item)}
        >
          <Text
            style={{
              marginLeft: 8,
              fontWeight: "600",
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 6,
              borderWidth: 1,
              opacity: isFavorite ? 0.6 : 1,
            }}
          >
            {isFavorite ? "Favorit" : "Tilføj"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFavorite = ({ item }) => (
    <View
      style={[
        favoritesStyles.item,
        shadows.subtle,
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text
          style={[
            text.body,
            { color: colors.primaryText, fontWeight: "700" },
          ]}
        >
          {item.name}
        </Text>
        {!!item.address && (
          <Text style={[text.small, { color: colors.secondaryText }]}>
            {item.address}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => removeFavorite(item.id)}>
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

        {/* Search input */}
        <TextInput
          style={[form.input, { marginTop: 16 }]}
          placeholder="Søg efter kaffebar"
          value={search}
          onChangeText={setSearch}
        />

        {/* Search results from cafes in DB */}
        <Text style={[text.label, { marginTop: 16, marginBottom: 4 }]}>
          Kaffebarer
        </Text>
        <FlatList
          style={{ maxHeight: 220 }}
          // ⬇️ limit to max 5
          data={filteredCafes.slice(0, 5)}
          keyExtractor={(item) => item.id}
          renderItem={renderCafeResult}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            loadingCafes ? (
              <Text style={text.body}>Henter kaffebarer...</Text>
            ) : (
              <Text style={[text.body, favoritesStyles.placeholder]}>
                Ingen kaffebarer fundet.
              </Text>
            )
          }
        />

        {/* Saved favorites section */}
        <Text style={[text.label, { marginTop: 24, marginBottom: 4 }]}>
          Dine favoritter
        </Text>
        <FlatList
          data={favoriteCafes}
          keyExtractor={(item) => item.id}
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