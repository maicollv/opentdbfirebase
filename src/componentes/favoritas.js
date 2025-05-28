import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function Favoritas() {
  const [usuario, setUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    async function fetchUsuarioYFavoritos() {
      const user = auth.currentUser;
      if (user) {
        // Buscar datos del usuario en Firestore
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsuario(userData);
          fetchFavoritos(user.uid);
        }
      }
    }

    fetchUsuarioYFavoritos();
  }, []);

  const fetchFavoritos = async (usuarioid) => {
    const favoritosRef = collection(db, 'favoritos');
    const q = query(favoritosRef, where('usuarioid', '==', usuarioid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());
    setFavoritos(data);
  };

  const mezclarRespuestas = (pregunta) => {
    const respuestas = [...(pregunta.incorrecta || []), pregunta.correcta];
    return respuestas.sort(() => Math.random() - 0.5);
  };

  if (!usuario) return <Text style={styles.cargando}>Cargando usuario...</Text>;

  if (favoritos.length === 0) {
    return <Text style={styles.cargando}>No hay preguntas favoritas aún.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preguntas favoritas</Text>
      {favoritos.map((pregunta, index) => (
        <View key={index} style={styles.preguntaContainer}>
          <Text style={styles.pregunta}>{pregunta.pregunta}</Text>
          <Text><Text style={styles.label}>Categoría:</Text> {pregunta.categoria}</Text>
          <Text><Text style={styles.label}>Dificultad:</Text> {pregunta.dificultad}</Text>
          <Text style={styles.label}>Respuestas posibles:</Text>
          {mezclarRespuestas(pregunta).map((respuesta, i) => (
            <Text
              key={i}
              style={[
                styles.respuesta,
                respuesta === pregunta.correcta ? styles.correcta : styles.incorrecta
              ]}
            >
              {respuesta}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preguntaContainer: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 15,
  },
  pregunta: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  respuesta: {
    marginLeft: 10,
    fontSize: 14,
    marginVertical: 2,
  },
  correcta: {
    color: 'green',
    fontWeight: 'bold',
  },
  incorrecta: {
    color: 'red',
  },
  cargando: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
  }
});
