// anton
import { StatusBar } from 'expo-status-bar';
import { FlatList, Text, View } from 'react-native';
import { layout, text, home } from '../styles/styles';

const CoffeeTypes = [
  {
    id: '1',
    name: 'Americano',
    description: 'Espresso fortyndet med varmt vand – giver en mildere smag end ren espresso.',
  },
  {
    id: '2',
    name: 'Espresso',
    description: 'En koncentreret kaffe brygget under tryk, serveret i små mængder.',
  },
  {
    id: '3',
    name: 'Cortado',
    description: 'Espresso blandet med en lille mængde varm mælk – balanceret og cremet.',
  },
  {
    id: '4',
    name: 'Cappuccino',
    description: 'Espresso med dampet mælk og et luftigt mælkeskum på toppen.',
  },
  {
    id: '5',
    name: 'Latte',
    description: 'En blød og cremet kombination af espresso og meget mælk, ofte med latte art.',
  },
  {
    id: '6',
    name: 'Flat White',
    description: 'Australsk klassiker: espresso med silkeblød mikroskum-mælk.',
  },
  {
    id: '7',
    name: 'Macchiato',
    description: 'Espresso "plettet" med en smule mælkeskum.',
  },
  {
    id: '8',
    name: 'Mocha',
    description: 'En sød kombination af espresso, chokolade og varm mælk.',
  },
  {
    id: '9',
    name: 'Cold Brew',
    description: 'Kaffe udtrukket koldt over flere timer – mild og forfriskende.',
  },
  {
    id: '10',
    name: 'Ristretto',
    description: 'En endnu mere koncentreret version af espresso – kort, intens og kraftig.',
  },
];

export default function HomeScreen() {
  const renderCoffeeTypes = ({ item }) => (
    <View style={layout.card}>
      <Text style={[text.h3, home.name]}>{item.name}</Text>
      <Text style={[text.bodySmall, home.description]}>{item.description}</Text>
    </View>
  );

  return (
    <View style={layout.screen}>
      <Text style={text.h1}>Not sure what Coffee is what? Here's your guide:</Text>
      <FlatList
        data={CoffeeTypes}
        keyExtractor={(item) => item.id}
        renderItem={renderCoffeeTypes}
        contentContainerStyle={layout.listContent}
      />
      <StatusBar style="dark" />
    </View>
  );
}