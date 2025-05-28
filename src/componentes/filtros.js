import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useColorScheme } from 'react-native';

const coloresClaro = ['#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ff9800', '#795548'];
const coloresOscuro = ['#ff80ab', '#ce93d8', '#90caf9', '#a5d6a7', '#ffcc80', '#a1887f'];

export default function Filtro({ onCategoriaChange }) {
  const [categorias, setCategorias] = useState([]);
  const [colorHoverId, setColorHoverId] = useState(null);

  const colorScheme = useColorScheme();
  const colores = colorScheme === 'dark' ? coloresOscuro : coloresClaro;

  useEffect(() => {
    async function obtenerCategorias() {
      try {
        const res = await fetch('https://opentdb.com/api_category.php');
        const data = await res.json();
        if (data.trivia_categories) {
          setCategorias(data.trivia_categories);
        }
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    }
    obtenerCategorias();
  }, []);

  // En React Native no hay hover, pero podemos usar el estado colorHoverId para simular selección

  const handlePressIn = (id) => {
    setColorHoverId(id);
  };

  const handlePressOut = () => {
    setColorHoverId(null);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <TouchableOpacity
        onPress={() => onCategoriaChange('')}
        onPressIn={() => handlePressIn('todas')}
        onPressOut={handlePressOut}
        style={styles.boton}
      >
        <Text style={[styles.textoBoton, { color: colorHoverId === 'todas' ? colores[Math.floor(Math.random() * colores.length)] : '#000' }]}>
          Todas
        </Text>
      </TouchableOpacity>

      {categorias.map(categoria => (
        <TouchableOpacity
          key={categoria.id}
          onPress={() => onCategoriaChange(categoria.id)}
          onPressIn={() => handlePressIn(categoria.id)}
          onPressOut={handlePressOut}
          style={styles.boton}
        >
          <Text style={[styles.textoBoton, { color: colorHoverId === categoria.id ? colores[Math.floor(Math.random() * colores.length)] : '#000' }]}>
            {categoria.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#eee',
  },
  boton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  textoBoton: {
    fontSize: 14,
    fontWeight: '600',
  },
});
