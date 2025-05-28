import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/contexto/contexto';

// Pantallas principales
import Login from './src/componentes/login';
import Registro from './src/componentes/registro';

// Navegación con pestañas
import Tabs from './src/componentes/Tabs'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
          <Stack.Screen name="Menu" component={Tabs} options={{ headerShown: false }} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
