import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Menu() {
  const navigation = useNavigation();

  return (
    <View style={styles.menu}>
      <Button title="Inicio" onPress={() => navigation.navigate('Inicio')} />
      <Button title="Preguntas" onPress={() => navigation.navigate('Preguntas')} />
      <Button title="Buscar" onPress={() => navigation.navigate('Buscar')} />
      <Button title="Categorías" onPress={() => navigation.navigate('Categorias')} />
      <Button title="Favoritas" onPress={() => navigation.navigate('Favoritas')} />
      <Button title="Original" onPress={() => navigation.navigate('Original')} />
      <Button title="Configuración" onPress={() => navigation.navigate('Configuracion')} />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    padding: 10,
    gap: 10,
  },
});
