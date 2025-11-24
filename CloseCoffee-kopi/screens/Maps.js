// Cæcilia
import React, { useState, useCallback } from "react";
import * as Location from "expo-location";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { get } from "firebase/database";

import { cafesRef } from "../firebase/database";
import { colors, layout } from "../styles/styles";

export default function Maps() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [cafes, setCafes] = useState([]); // id, navn ,adresse 
  const [region, setRegion] = useState({
    latitude: 56.26392,   
    longitude: 9.501785,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Hent cafeer 1 gang fra firebase coffeeDatabase - dannet via. chatGpt for at finde fejlkoder
const getCafes = async () => {
  try {
    const snap = await get(cafesRef());
    console.log("cafes exists?", snap.exists());
    console.log("cafes data:", snap.val());

    const data = snap.val() || {};
    const list = Object.entries(data).map(([id, c]) => ({
      id,
      name: c?.name ?? "Ukendt",
      address: c?.address ?? "",
      latitude:
        typeof c?.latitude === "string" ? parseFloat(c.latitude) : c?.latitude,
      longitude:
        typeof c?.longitude === "string" ? parseFloat(c.longitude) : c?.longitude,
    }));
    setCafes(list);

    const latest = list.at(-1);
    if (latest && (!region || region.latitude === 56.26392)) {
      setRegion((r) => ({
        ...r,
        latitude: latest.latitude,
        longitude: latest.longitude,
      }));
    }
  } catch (e) {
    console.error("Error loading cafes:", e);
   
  }
};

  // hent brugerens lokation 
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const { coords } = await Location.getCurrentPositionAsync({});
    setRegion((r) => ({
      ...r,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));
  };

  // hent cafeer + lokation
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([getCafes(), getLocation()]).finally(() => setLoading(false));
    }, [])
  );

  // gå videre til bestillingsskærm
  const goToOrder = (cafe) => {
    navigation.navigate("Order", {
      cafeId: cafe.id,
      cafeName: cafe.name,
      address: cafe.address,
      latitude: cafe.latitude,
      longitude: cafe.longitude,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation>

        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }}
            title={cafe.name}
            pinColor={colors.accent}>

            <Callout onPress={() => goToOrder(cafe)}>
              <View style={styles.callout}>
                <Text style={styles.title}>{cafe.name}</Text>
                <Text style={styles.subtitle}>{cafe.address}</Text>
                <Text style={styles.link}>Tryk for at bestille</Text>
              </View>
            </Callout>

          </Marker>
        ))}
      </MapView>
    </View>
  );
}

// lokal styling, skal flyttes til styles mappe
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  callout: { width: 200 },
  title: { fontWeight: "bold", fontSize: 16, color: colors.primaryText },
  subtitle: { fontSize: 13, color: colors.secondaryText, marginTop: 2 },
  link: { fontSize: 13, marginTop: 6, color: colors.accent, fontWeight: "600" },
});
