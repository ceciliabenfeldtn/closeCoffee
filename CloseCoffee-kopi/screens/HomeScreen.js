// HomeScreen.js
// anton

import React, { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { layout, text, home } from "../styles/styles";
import { auth, cafesRef, userRef, userFavoritesRef } from "../firebase/database";
import { get, onValue } from "firebase/database";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [userName, setUserName] = useState("");
  const [cafes, setCafes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Load cafés from /cafes (one-time)
  useEffect(() => {
    const loadCafes = async () => {
      try {
        const snap = await get(cafesRef());
        const data = snap.val() || {};
        const list = Object.entries(data).map(([id, c]) => ({
          id,
          name: c?.name ?? "Ukendt",
          address: c?.address ?? "",
          specialties: c?.specialties ?? "",
        }));
        setCafes(list);
      } catch (e) {
        console.error("Error loading cafes on home", e);
      }
    };

    loadCafes();
  }, []);

  // Live updates: user name + favorites
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const profileRef = userRef(user.uid);
    const favRef = userFavoritesRef(user.uid);

    // listen for name changes
    const unsubProfile = onValue(profileRef, (snap) => {
      const data = snap.val() || {};
      setUserName(data.name ?? "");
    });

    // listen for favorites changes
    const unsubFavs = onValue(favRef, (snap) => {
      const data = snap.val() || {};
      setFavoriteIds(Object.keys(data));
    });

    return () => {
      unsubProfile();
      unsubFavs();
    };
  }, []);

  // Top 5 cafés from DB
  const topCafes = useMemo(() => cafes.slice(0, 5), [cafes]);

  // Favourite cafés with full data
  const favoriteCafes = useMemo(() => {
    if (!cafes.length) return [];
    return favoriteIds
      .map((id) => {
        const found = cafes.find((c) => c.id === id);
        if (found) return found;
        return { id, name: id, address: "", specialties: "" };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [favoriteIds, cafes]);

  const renderCoffeeBar = ({ item }) => (
    <View style={layout.card}>
      <Text style={[text.h3, home.name]}>{item.name}</Text>
      {!!item.address && (
        <Text style={[text.bodySmall, home.address]}>{item.address}</Text>
      )}
      {!!item.specialties && (
        <Text style={text.small}>{item.specialties}</Text>
      )}
    </View>
  );

  const goToOrder = (cafe) => {
    navigation.navigate("Order", {
      cafeId: cafe.id,
      cafeName: cafe.name,
      address: cafe.address,
    });
  };

  return (
    <View style={layout.screen}>
      <FlatList
        data={topCafes}
        keyExtractor={(item) => item.id}
        renderItem={renderCoffeeBar}
        contentContainerStyle={layout.listContent}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <Text style={text.h1}>
              {userName ? `Welcome, ${userName}` : "Welcome"}
            </Text>
            <Text style={text.body}>
              Discover great coffee spots and keep track of your favorites.
            </Text>

            <View style={{ marginTop: 24 }}>
              <Text style={text.h2}>Top coffee bars</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={{ marginTop: 24 }}>
            <Text style={text.h2}>Your favourites</Text>

            {favoriteCafes.length === 0 ? (
              <Text style={[text.bodySmall, { marginTop: 8 }]}>
                You haven't saved any favorite coffee bars yet.
              </Text>
            ) : (
              favoriteCafes.map((cafe) => (
                <TouchableOpacity
                  key={cafe.id}
                  onPress={() => goToOrder(cafe)}
                  activeOpacity={0.8}
                >
                  <View style={layout.card}>
                    <Text style={[text.h3, home.name]}>{cafe.name}</Text>
                    {!!cafe.address && (
                      <Text style={[text.bodySmall, home.address]}>
                        {cafe.address}
                      </Text>
                    )}
                    {!!cafe.specialties && (
                      <Text style={text.small}>{cafe.specialties}</Text>
                    )}
                    <Text
                      style={[
                        text.small,
                        { marginTop: 6, color: "#888", fontStyle: "italic" },
                      ]}
                    >
                      Tap to order from this café
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="dark" />
    </View>
  );
}