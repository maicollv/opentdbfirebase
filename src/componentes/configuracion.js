import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function Configuracion() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [tamFuente, setTamFuente] = useState('mediano');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Cargar configuración al iniciar
    (async () => {
      try {
        const temaGuardado = await AsyncStorage.getItem('temaOscuro');
        const tamFuenteGuardado = await AsyncStorage.getItem('tamFuente');
        if (temaGuardado !== null) setTemaOscuro(temaGuardado === 'true');
        if (tamFuenteGuardado !== null) setTamFuente(tamFuenteGuardado);
      } catch (e) {
        console.error('Error al cargar configuración:', e);
      }
    })();
  }, []);

  useEffect(() => {
    // Guardar tema oscuro
    AsyncStorage.setItem('temaOscuro', temaOscuro.toString());
  }, [temaOscuro]);

  useEffect(() => {
    // Guardar tamaño fuente
    AsyncStorage.setItem('tamFuente', tamFuente);
  }, [tamFuente]);

  const fontSize =
    tamFuente === 'pequeño' ? 14 :
    tamFuente === 'grande' ? 20 :
    16;

  return (
    <View style={[styles.container, temaOscuro && styles.temaOscuro]}>
      <Text style={[styles.title, { fontSize: fontSize + 4 }]}>Configuración</Text>

      <View style={styles.section}>
        <Text style={[styles.subtitle, { fontSize }]}>Preferencias</Text>

        <View style={styles.switchRow}>
          <Text style={[styles.label, { fontSize }]}>Tema oscuro</Text>
          <Switch
            value={temaOscuro}
            onValueChange={setTemaOscuro}
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={[styles.label, { fontSize }]}>Tamaño de fuente:</Text>
          <Picker
            selectedValue={tamFuente}
            onValueChange={setTamFuente}
            style={{ color: temaOscuro ? 'white' : 'black' }}
          >
            <Picker.Item label="Pequeño" value="pequeño" />
            <Picker.Item label="Mediano" value="mediano" />
            <Picker.Item label="Grande" value="grande" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.subtitle, { fontSize }]}>Acerca de la app</Text>
        <Text style={[styles.text, { fontSize }]}>
          Esta aplicación fue desarrollada para ofrecerte una experiencia personalizada.
        </Text>
        <Text style={[styles.text, { fontSize }]}>Versión: 1.0.0</Text>
      </View>

      {mensaje ? (
        <Text style={{ color: 'green', fontSize }}>{mensaje}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  temaOscuro: {
    backgroundColor: '#222',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007AFF',
  },
  section: {
    marginBottom: 30,
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  text: {
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: '#333',
  },
});

