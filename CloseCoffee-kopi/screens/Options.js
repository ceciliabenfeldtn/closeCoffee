// anton
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { layout, text } from '../styles/styles';

export default function Options() {
  return (
    <View style={layout.screen}>
      <Text style={text.h1}>Options</Text>

      <View style={layout.card}>
        <Text style={[text.body, { marginBottom: 12 }]}>
          Settings and customization options are coming soon.
        </Text>
        <Text style={text.small}>
          Check back later to tweak notifications, themes, and other preferences.
        </Text>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}
