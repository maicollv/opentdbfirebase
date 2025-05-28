import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app, db } from "../../firebase/firebaseConfig";

export default function Preguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [token, setToken] = useState('');
  const auth = getAuth(app);
  const user = auth.currentUser;

  // Obtener un nuevo token (o reiniciarlo)
  const obtenerToken = async () => {
    try {
      const res = await fetch('https://opentdb.com/api_token.php?command=request');
      const data = await res.json();
      setToken(data.token);
    } catch (e) {
      Alert.alert('Error', 'No se pudo obtener token');
    }
  };

  // Cargar preguntas con el token actual
  const cargarPreguntas = async () => {
    if (!token) {
      Alert.alert('Aviso', 'No hay token disponible para cargar preguntas');
      return;
    }
    try {
      // Usamos encode=url3986 para evitar problemas con caracteres especiales
      const res = await fetch(`https://opentdb.com/api.php?amount=10&token=${token}&encode=url3986`);
      const data = await res.json();

      if (data.response_code === 4) {
        // Token agotado, solicitar uno nuevo y recargar
        await obtenerToken();
      } else if (data.results) {
        // Decodificar preguntas para evitar encoding raro
        const decodedQuestions = data.results.map(q => ({
          ...q,
          question: decodeURIComponent(q.question),
          correct_answer: decodeURIComponent(q.correct_answer),
          category: decodeURIComponent(q.category),
          difficulty: decodeURIComponent(q.difficulty),
          incorrect_answers: q.incorrect_answers.map(ans => decodeURIComponent(ans)),
        }));
        setPreguntas(decodedQuestions);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar preguntas');
    }
  };

  // Al iniciar la app, obtener token
  useEffect(() => {
    obtenerToken();
  }, []);

  // Cuando cambia token, cargar preguntas
  useEffect(() => {
    if (token) {
      cargarPreguntas();
    }
  }, [token]);

  // Cargar favoritos del usuario
  useEffect(() => {
    if (!user) return;
    const cargarFavoritos = async () => {
      try {
        const q = query(collection(db, 'favoritos'), where('usuarioId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const favs = [];
        querySnapshot.forEach((doc) => {
          favs.push({ id: doc.id, ...doc.data() });
        });
        setFavoritos(favs);
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar los favoritos');
      }
    };
    cargarFavoritos();
  }, [user]);

  // Chequear si pregunta es favorita (comparando texto)
  const esFavorito = (pregunta) => {
    return favoritos.some(fav => fav.pregunta === pregunta.question);
  };

  // Añadir o quitar favorito
  const toggleFavorito = async (pregunta) => {
    if (!user) {
      Alert.alert('Inicia sesión para guardar favoritos');
      return;
    }

    try {
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
        setFavoritos(prev => [...prev, {
          id: docRef.id,
          usuarioId: user.uid,
          pregunta: pregunta.question,
          correcta: pregunta.correct_answer,
          categoria: pregunta.category,
          dificultad: pregunta.difficulty,
          incorrectas: pregunta.incorrect_answers,
        }]);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar favorito');
    }
  };

  const renderPregunta = ({ item }) => (
    <View style={styles.preguntaCont}>
      <Text style={styles.preguntaTexto}>{item.question}</Text>
      <TouchableOpacity onPress={() => toggleFavorito(item)} style={styles.botonFavorito}>
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
      <Button title="Recargar preguntas" onPress={async () => { await obtenerToken(); }} />
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
