import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar pantallas
import Inicio from './src/componentes/inicio';
import Login from './src/componentes/login';
import Registro from './src/componentes/registro';
import Preguntas from './src/componentes/preguntas';
import Buscar from './src/componentes/buscar';
import Categorias from './src/componentes/Categorias';
import Favoritas from './src/componentes/favoritos';
import Filtros from './src/componentes/filtros';
import Menu from './src/componentes/menu';
import Original from './src/componentes/original';
import Configuracion from './src/componentes/configuracion';

// Inicializar stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Preguntas" component={Preguntas} />
        <Stack.Screen name="Buscar" component={Buscar} />
        <Stack.Screen name="Categorias" component={Categorias} />
        <Stack.Screen name="Favoritas" component={Favoritas} />
        <Stack.Screen name="Filtros" component={Filtros} />
        <Stack.Screen name="Original" component={Original} />
        <Stack.Screen name="Configuracion" component={Configuracion} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
