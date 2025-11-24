// Options.js
// anton & cæcilia

import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, form, layout, shadows, text } from "../styles/styles";
import { auth, userRef } from "../firebase/database";
import { get, update } from "firebase/database";

export default function OptionsScreen() {
  const [name, setName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const snap = await get(userRef(user.uid));
        const data = snap.val() || {};
        setName(data.name ?? "");
      } catch (e) {
        console.error("Error loading profile from options", e);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveName = async () => {
    const user = auth.currentUser;
    if (!user) {
      return Alert.alert(
        "Ikke logget ind",
        "Du skal være logget ind for at gemme dine indstillinger."
      );
    }

    try {
      await update(userRef(user.uid), { name: name.trim() });
      Alert.alert("Gemt", "Dit navn er opdateret.");
    } catch (e) {
      console.error("Error saving name from options", e);
      Alert.alert("Fejl", "Kunne ikke gemme dit navn.");
    }
  };

  return (
    <View style={layout.screen}>
      <View style={layout.content}>
        <Text style={text.h1}>Indstillinger</Text>

        {/* Card for name setting */}
        <View
          style={[
            layout.card,
            shadows.subtle,
            { marginTop: 24, backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={text.h2}>Profil</Text>

          <Text style={[text.label, { marginTop: 16 }]}>Navn</Text>
          <TextInput
            style={[form.input, { marginTop: 8 }]}
            value={name}
            onChangeText={setName}
            editable={!loadingProfile}
            placeholder="Skriv dit navn"
          />

          <TouchableOpacity
            style={[form.button, { marginTop: 12 }]}
            onPress={handleSaveName}
            disabled={loadingProfile}
          >
            <Text style={form.buttonText}>
              {loadingProfile ? "Henter..." : "Gem navn"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}