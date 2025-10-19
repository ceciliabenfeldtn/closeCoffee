// App.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import Favorites from './screens/Favorites';
import Maps from './screens/Maps';
import Order from './screens/order';
import Options from './screens/Options';
import Profile from './screens/Profile';
import Login from './screens/login'; 

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './styles/styles';

import { auth } from './firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

//Naviation i bunden
function MainTabs() {
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: colors.background }}
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.accent },
        headerTitleStyle: { color: colors.primaryText },
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: { backgroundColor: colors.cardBackground },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Map') iconName = 'map';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={Maps} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

//Naviation i profil.js og underskærme
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.accent },
        headerTitleStyle: { color: colors.primaryText },
        headerTintColor: colors.primaryText,
      }}
    >
      <Stack.Screen name="Back" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Favorites" component={Favorites} options={{ title: 'Favorites' }} />
      <Stack.Screen name="Options" component={Options} options={{ title: 'Options' }} />
      <Stack.Screen name="Order" component={Order} options={{ title: 'Order' }} />
    </Stack.Navigator>
  );
}
//Flow for 
function AuthFlow() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.accent },
        headerTitleStyle: { color: colors.primaryText },
        headerTintColor: colors.primaryText,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} options={{ title: 'Sign in' }} />
    </AuthStack.Navigator>
  );
}

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  if (initializing) return <Loading />;

  return <NavigationContainer>{user ? <AppStack /> : <AuthFlow />}</NavigationContainer>;
}