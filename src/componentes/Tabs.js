import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Pantallas
import Inicio from './inicio';
import Preguntas from './preguntas';
import Buscar from './buscar';
import Categorias from './Categorias';
import Favoritas from './favoritas';
import Original from './original';
import Configuracion from './configuracion';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Inicio': iconName = 'home'; break;
            case 'Preguntas': iconName = 'help-circle'; break;
            case 'Buscar': iconName = 'search'; break;
            case 'Categorías': iconName = 'list'; break;
            case 'Favoritas': iconName = 'heart'; break;
            case 'Original': iconName = 'bulb'; break;
            case 'Configuración': iconName = 'settings'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={Inicio} />
      <Tab.Screen name="Preguntas" component={Preguntas} />
      <Tab.Screen name="Buscar" component={Buscar} />
      <Tab.Screen name="Categorías" component={Categorias} />
      <Tab.Screen name="Favoritas" component={Favoritas} />
      <Tab.Screen name="Original" component={Original} />
      <Tab.Screen name="Configuración" component={Configuracion} />
    </Tab.Navigator>
  );
}
