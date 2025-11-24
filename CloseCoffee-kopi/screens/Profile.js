// anton
import { StatusBar } from 'expo-status-bar';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { form, layout, text } from '../styles/styles';
import { auth, userRef } from '../firebase/database';
import { signOut } from 'firebase/auth';
import { remove } from 'firebase/database';

export default function Profile({ navigation }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Sign out failed', 'Please try again.');
      console.error('Sign out error:', err);
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) {
                Alert.alert("Error", "You are not logged in.");
                return;
              }

              // 1. Delete user data from Realtime Database
              await remove(userRef(user.uid));

              // 2. Delete Firebase Auth account
              await user.delete();

              Alert.alert("Profile deleted", "Your account has been permanently removed.");

              // ✅ No manual navigation needed – your auth flow will detect
              // that there is no currentUser and show the login screen.
            } catch (e) {
              console.error("Delete profile error:", e);
              Alert.alert(
                "Error",
                "Could not delete your profile. You may need to log in again before deleting."
              );
            }
          }
        }
      ]
    );
  };

  return (
    <View style={layout.screen}>
      <Text style={text.h1}>Welcome to your profile</Text>

      <View style={layout.card}>
        <Text style={[text.body, { marginBottom: 16 }]}>
          Jump straight to your saved spots or adjust app preferences.
        </Text>

        <TouchableOpacity
          style={[form.button, { marginBottom: 12 }]}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={form.buttonText}>View favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={form.button} onPress={() => navigation.navigate('Options')}>
          <Text style={form.buttonText}>Open options</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[form.button, { marginTop: 20 }]}
          onPress={handleSignOut}
        >
          <Text style={form.buttonText}>Sign out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[form.button, { marginTop: 20, backgroundColor: "#d9534f" }]}
          onPress={handleDeleteProfile}
        >
          <Text style={[form.buttonText, { color: "#fff" }]}>
            Delete Profile
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}