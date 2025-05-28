import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

export default function Preguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [token, setToken] = useState('');
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = auth.currentUser;

  useEffect(() => {
    // Obtener token una vez
    const obtenerToken = async () => {
      try {
        const res = await fetch('https://opentdb.com/api_token.php?command=request');
        const data = await res.json();
        setToken(data.token);
      } catch (e) {
        Alert.alert('Error', 'No se pudo obtener token');
      }
    };
    obtenerToken();
  }, []);

  // Cargar preguntas
  useEffect(() => {
    if (!token) return;
    const cargar = async () => {
      try {
        const res = await fetch(`https://opentdb.com/api.php?amount=10&token=${token}`);
        const data = await res.json();
        if (data.results) {
          setPreguntas(data.results);
        }
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar preguntas');
      }
    };
    cargar();
  }, [token]);

  // Cargar favoritos del usuario
  useEffect(() => {
    if (!user) return;
    const cargarFavoritos = async () => {
      const q = query(collection(db, 'favoritos'), where('usuarioId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const favs = [];
      querySnapshot.forEach((doc) => {
        favs.push({ id: doc.id, ...doc.data() });
      });
      setFavoritos(favs);
    };
    cargarFavoritos();
  }, [user]);

  // Comprobar si pregunta es favorita
  const esFavorito = (pregunta) => {
    return favoritos.some(fav => fav.pregunta === pregunta.question);
  };

  // Toggle favorito (agregar o eliminar)
  const toggleFavorito = async (pregunta) => {
    if (!user) {
      Alert.alert('Inicia sesión para guardar favoritos');
      return;
    }

    try {
      // Buscar favorito
      const favExistente = favoritos.find(fav => fav.pregunta === pregunta.question);

      if (favExistente) {
        // Eliminar favorito
        await deleteDoc(doc(db, 'favoritos', favExistente.id));
        setFavoritos(prev => prev.filter(f => f.id !== favExistente.id));
      } else {
        // Agregar favorito
        const docRef = await addDoc(collection(db, 'favoritos'), {
          usuarioId: user.uid,
          pregunta: pregunta.question,
          correcta: pregunta.correct_answer,
          categoria: pregunta.category,
          dificultad: pregunta.difficulty,
          incorrectas: pregunta.incorrect_answers,
        });
        setFavoritos(prev => [...prev, { id: docRef.id, ...pregunta }]);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar favorito');
    }
  };

  const renderPregunta = ({ item }) => (
    <View style={styles.preguntaCont}>
      <Text style={styles.preguntaTexto}>{item.question}</Text>
      <TouchableOpacity
        onPress={() => toggleFavorito(item)}
        style={styles.botonFavorito}
      >
        <Text style={{ fontSize: 20 }}>{esFavorito(item) ? '⭐' : '☆'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Preguntas</Text>
      <FlatList
        data={preguntas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPregunta}
      />
      <Button title="Recargar preguntas" onPress={() => setToken('')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  preguntaCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  preguntaTexto: { flex: 1 },
  botonFavorito: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});
