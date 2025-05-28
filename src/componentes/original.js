import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert 
} from 'react-native';

// Función simple para decodificar HTML entities en React Native
function decodeHtml(html) {
  const entities = {
    '&quot;': '"',
    '&#039;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&eacute;': 'é',
    '&uuml;': 'ü',
    // agrega más según necesites
  };
  return html.replace(/&quot;|&#039;|&amp;|&lt;|&gt;|&eacute;|&uuml;/g, match => entities[match] || match);
}

export default function Original() {
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [tiempo, setTiempo] = useState(30);
  const [jugando, setJugando] = useState(false);
  const [terminado, setTerminado] = useState(false);

  useEffect(() => {
    let timer;
    if (jugando && tiempo > 0) {
      timer = setTimeout(() => setTiempo(t => t - 1), 1000);
    } else if (jugando && tiempo === 0) {
      setJugando(false);
      setTerminado(true);
    }
    return () => clearTimeout(timer);
  }, [jugando, tiempo]);

  const iniciarJuego = async () => {
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=20&type=multiple');
      const data = await res.json();
      if (data.results) {
        setPreguntas(data.results);
        setIndice(0);
        setPuntaje(0);
        setTiempo(30);
        setJugando(true);
        setTerminado(false);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el juego");
    }
  };

  const manejarRespuesta = (respuesta) => {
    if (respuesta === preguntas[indice].correct_answer) {
      setPuntaje(p => p + 1);
    }
    if (indice < preguntas.length - 1) {
      setIndice(i => i + 1);
    } else {
      setJugando(false);
      setTerminado(true);
    }
  };

  const mezclar = (opciones) => {
    return opciones.sort(() => Math.random() - 0.5);
  };

  if (!jugando && !terminado) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Reto Relámpago ⚡</Text>
        <Text style={styles.texto}>Responde tantas preguntas como puedas en 30 segundos.</Text>
        <TouchableOpacity style={styles.boton} onPress={iniciarJuego}>
          <Text style={styles.textoBoton}>¡Comenzar!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (terminado) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>¡Tiempo terminado!</Text>
        <Text style={styles.texto}>Tu puntaje: {puntaje}</Text>
        <TouchableOpacity style={styles.boton} onPress={iniciarJuego}>
          <Text style={styles.textoBoton}>Jugar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const preguntaActual = preguntas[indice];
  const respuestas = mezclar([
    ...preguntaActual.incorrect_answers,
    preguntaActual.correct_answer
  ]);

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.pregunta}>{decodeHtml(preguntaActual.question)}</Text>
      {respuestas.map((resp, i) => (
        <TouchableOpacity
          key={i}
          style={styles.opcion}
          onPress={() => manejarRespuesta(resp)}
        >
          <Text style={styles.textoOpcion}>{decodeHtml(resp)}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.info}>
        <Text style={styles.infoText}>⏱️ {tiempo}s</Text>
        <Text style={styles.infoText}>Puntaje: {puntaje}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 18,
  },
  pregunta: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: '600',
  },
  opcion: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  textoOpcion: {
    fontSize: 16,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
