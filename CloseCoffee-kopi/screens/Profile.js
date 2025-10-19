// anton
import { StatusBar } from 'expo-status-bar';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { form, layout, text } from '../styles/styles';
import { auth } from '../firebase/database';
import { signOut } from 'firebase/auth';

export default function Profile({ navigation }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Sign out failed', 'Please try again.');
      console.error('Sign out error:', err);
    }
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
      </View>

      <StatusBar style="dark" />
    </View>
  );
}
