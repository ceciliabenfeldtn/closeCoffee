// Cæcilia 
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { layout, text, form, colors, shadows } from "../styles/styles";

import { rtdbCoffee, ordersRef } from "../firebase/coffeeDatabase";
import { get, ref, push, serverTimestamp } from "firebase/database";
import { auth } from "../firebase/database";

export default function Order() {
  const navigation = useNavigation();
  const { cafeId, cafeName, address } = useRoute().params || {}; // henter navigation og parametre fra maps-skærm

  const [menu, setMenu] = useState([]); // gemme menu fra database 
  const [quantities, setQuantities] = useState({});  // og brugerens valgte drikkevarer

  // hent menu fra databasen
  useEffect(() => {
    (async () => {
      try {
        const snap = await get(ref(rtdbCoffee, `cafes/${cafeId}/menu`));
        const data = snap.val() || {};
        const list = Object.entries(data).map(([id, v]) => ({
          id,
          label: v?.label ?? id,
          price: typeof v?.price === "number" ? v.price : parseFloat(v?.price ?? 0),
        }));
        setMenu(list);
      } catch {
        Alert.alert("Kunne ikke hente menu");
      }
    })();
  }, [cafeId]);

  // udregner totalpris ud fravalgte drikkevarer 
  const total = menu.reduce((sum, m) => sum + (quantities[m.id] || 0) * m.price, 0);

  // opdaterer antal for drikkevarer 
  const changeQty = (id, delta) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  // gem bestilling i firebase coffeeDatabase med brugerid som er logget ind
  const confirmOrder = async () => {
    
    // lave liste af drikkevarer inden det sendes til database
    const items = menu
      .filter((m) => (quantities[m.id] || 0) > 0) // kun valgte drikke medtages
      .map((m) => ({ // omdanner til objekt med værdier
        drinkId: m.id,
        drinkLabel: m.label,
        unitPrice: m.price,
        qty: quantities[m.id],
        subtotal: m.price * quantities[m.id],
      }));

    if (items.length === 0) {
      return Alert.alert("Ingen varer", "Vælg mindst én kaffe."); // advarsel hvis intet valgt
    }

    const uid = auth?.currentUser?.uid || null; //hvilken bruger laver bestillingen

    const payload = {
      cafeId,
      cafeName,
      address,
      items,          // alle valgte drikke med mængder
      total,          // samlet total
      userId: uid,
    }; // samler alle oplysninger som sendes til database

    try { // gemmer til database 
      await push(ordersRef(), payload);
      Alert.alert("Bestilling sendt", `Total: ${total} kr`, [
        { text: "OK", onPress: () => navigation.goBack() }, // viser bekræftelse hvis det lykkes
      ]);
    } catch (e) { // hvis ingen bestilling = fejl
      Alert.alert("Fejl", e?.message ?? "Kunne ikke sende bestilling.");
    }
  };

  // views, viser bestillingsskærmen for brugeren
  // vælge drikkevarer, antal, se totalpris og sende bestilling:
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 28 }} style={layout.screen}>
     
      <View style={[styles.bestilling, shadows.subtle]}>
        <Text style={text.h1}>Bestilling</Text>
        {!!cafeName && <Text style={[text.h3, { marginTop: 4 }]}>{cafeName}</Text>}
        {!!address && <Text style={[text.small, { marginTop: 2 }]}>{address}</Text>}
      </View>

      <View style={[styles.bestilling, shadows.subtle]}>
        <Text style={text.h2}>Vælg drik</Text>

        <View style={{ marginTop: 10 }}>
          {menu.map((m) => {
            const qty = quantities[m.id] || 0;
            return (
              <View key={m.id} style={[styles.menu, shadows.light]}>
                <View style={{ flex: 1 }}>
                  <Text style={[text.h3, { marginBottom: 4 }]}>{m.label}</Text>
                  <Text style={text.bodySmall}>{m.price} kr</Text>
                </View>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={[form.button, styles.qtyBtn]}
                    onPress={() => changeQty(m.id, -1)}>
                    <Text style={form.buttonText}>-</Text>
                  </TouchableOpacity>

                  <Text style={[text.h3, { marginHorizontal: 8 }]}>{qty}</Text>

                  <TouchableOpacity
                    style={[form.button, styles.qtyBtn]}
                    onPress={() => changeQty(m.id, 1)}>
                    <Text style={form.buttonText}>+</Text>
                  </TouchableOpacity>

                </View>
                </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.bestilling, shadows.subtle]}>
        <Text style={text.h2}>Total</Text>
        <Text style={[text.h1, { marginTop: 4 }]}>{total} kr</Text>
      </View>

      <View style={[styles.bestilling, shadows.subtle]}>
        <TouchableOpacity style={[form.button, { marginBottom: 10 }]} onPress={confirmOrder}>
          <Text style={form.buttonText}>Send bestilling</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  // laves lokalt i denne omgang men skal ind i styles.js
  bestilling: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 20,
    marginBottom: 16,
  },

  menu: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 14,
    marginBottom: 10,
  },

  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { width: 38, height: 38 },
};
