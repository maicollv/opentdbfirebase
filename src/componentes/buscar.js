import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useAppContext } from '../../contexto/contexto';

export default function Buscar() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const { favoritos, setFavoritos } = useAppContext();

  const handleBuscar = async () => {
    if (busqueda.length < 3) return;

    try {
      const res = await fetch('https://opentdb.com/api.php?amount=50');
      const data = await res.json();
      if (data.results) {
        const filtrados = data.results.filter(p =>
          p.question.toLowerCase().includes(busqueda.toLowerCase())
        );
        setResultados(filtrados);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      setResultados([]);
    }
  };

  const toggleFavorito = (pregunta) => {
    const existe = favoritos.some(fav => fav.question === pregunta.question);
    if (existe) {
      setFavoritos(favoritos.filter(fav => fav.question !== pregunta.question));
    } else {
      setFavoritos([...favoritos, pregunta]);
    }
  };

  const esFavorito = (pregunta) => {
    return favoritos.some(fav => fav.question === pregunta.question);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}</Text>
      <TouchableOpacity onPress={() => toggleFavorito(item)} style={styles.favButton}>
        <Text style={{fontSize: 18}}>
          {esFavorito(item) ? '⭐' : '☆'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar preguntas</Text>
      <TextInput
        placeholder="Buscar por texto..."
        value={busqueda}
        onChangeText={setBusqueda}
        onSubmitEditing={handleBuscar}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleBuscar} style={styles.button}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      <FlatList
        data={resultados}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 24, marginBottom: 10 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  favButton: {
    marginLeft: 10,
  },
});


