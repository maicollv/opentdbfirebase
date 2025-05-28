import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Categorias() {
  const [preguntas, setPreguntas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [cargando, setCargando] = useState(false);

  // Lista básica de categorías con sus IDs de OpenTDB
  const categorias = [
    { label: 'Todas', value: '' },
    { label: 'General Knowledge', value: '9' },
    { label: 'Entertainment: Books', value: '10' },
    { label: 'Entertainment: Film', value: '11' },
    { label: 'Entertainment: Music', value: '12' },
    { label: 'Science & Nature', value: '17' },
    { label: 'Sports', value: '21' },
    // Agrega más según lo necesites
  ];

  useEffect(() => {
    const obtenerPreguntas = async () => {
      setCargando(true);
      try {
        const url = `https://opentdb.com/api.php?amount=20${categoriaSeleccionada ? `&category=${categoriaSeleccionada}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results) {
          setPreguntas(data.results);
        } else {
          setPreguntas([]);
        }
      } catch (error) {
        console.error('Error al obtener preguntas:', error);
        setPreguntas([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerPreguntas();
  }, [categoriaSeleccionada]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías de Trivia</Text>

      <Picker
        selectedValue={categoriaSeleccionada}
        onValueChange={(value) => setCategoriaSeleccionada(value)}
        style={styles.picker}
      >
        {categorias.map((cat) => (
          <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
        ))}
      </Picker>

      {cargando && <ActivityIndicator size="large" color="#007AFF" />}

      {!cargando && preguntas.length === 0 && (
        <Text>No hay preguntas disponibles para esta categoría.</Text>
      )}

      <FlatList
        data={preguntas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  picker: { marginBottom: 15 },
  list: { marginTop: 10 },
  item: {
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});


