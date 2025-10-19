// anton
import { StatusBar } from 'expo-status-bar';
import { FlatList, Text, View } from 'react-native';
import { layout, text, home } from '../styles/styles';

const coffeeBars = [
  {
    id: '1',
    name: 'Democratic Coffee',
    address: 'Krystalgade 15, København K',
    specialties: 'Filterkaffe på specialbønner & croissanter i verdensklasse',
  },
  {
    id: '2',
    name: 'Prolog Coffee Bar',
    address: 'Høkerboderne 16, København V',
    specialties: 'Eksperimenterende espressoblends & barista-workshops',
  },
];

const coffeeTypes = [
  {
    id: '1',
    name: 'Americano',
    description: 'Espresso diluted with hot water for a milder cup.',
  },
  {
    id: '2',
    name: 'Espresso',
    description: 'Concentrated coffee pulled under pressure, served in small shots.',
  },
  {
    id: '3',
    name: 'Cortado',
    description: 'Balanced mix of espresso and a splash of warm milk.',
  },
  {
    id: '4',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and airy foam on top.',
  },
  {
    id: '5',
    name: 'Latte',
    description: 'Creamy combination of espresso and plenty of milk.',
  },
  {
    id: '6',
    name: 'Flat White',
    description: 'Silky microfoam mellowing a double shot of espresso.',
  },
  {
    id: '7',
    name: 'Macchiato',
    description: 'Espresso "stained" with a spoon of milk foam.',
  },
  {
    id: '8',
    name: 'Mocha',
    description: 'Espresso blended with chocolate and steamed milk.',
  },
  {
    id: '9',
    name: 'Cold Brew',
    description: 'Slow-steeped coffee served chilled and smooth.',
  },
  {
    id: '10',
    name: 'Ristretto',
    description: 'Shorter, more intense extraction of espresso.',
  },
];

export default function HomeScreen() {
  const renderCoffeeBar = ({ item }) => (
    <View style={layout.card}>
      <Text style={[text.h3, home.name]}>{item.name}</Text>
      <Text style={[text.bodySmall, home.address]}>{item.address}</Text>
      <Text style={text.small}>{item.specialties}</Text>
    </View>
  );

  return (
    <View style={layout.screen}>
      <FlatList
        data={coffeeBars}
        keyExtractor={(item) => item.id}
        renderItem={renderCoffeeBar}
        contentContainerStyle={layout.listContent}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <Text style={text.h1}>Welcome to CloseCoffee</Text>
            <Text style={text.body}>
              Discover top cafés nearby first, then brush up on popular coffee styles below.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={{ marginTop: 24 }}>
            <Text style={text.h2}>Coffee Types Guide</Text>
            {coffeeTypes.map((type) => (
              <View key={type.id} style={layout.card}>
                <Text style={[text.h3, home.name]}>{type.name}</Text>
                <Text style={text.bodySmall}>{type.description}</Text>
              </View>
            ))}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="dark" />
    </View>
  );
}
