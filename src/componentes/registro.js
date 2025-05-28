import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { app, db } from "../../firebase/firebaseConfig";


export default function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    password: '',
    fechaNacimiento: '',
    telefono: '',
  });
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const auth = getAuth(app);
  
  const handleChange = (name, value) => {
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleRegistro = async () => {
    setError(null);

    const { nombre, correo, password, fechaNacimiento, telefono } = formulario;
    if (!nombre || !correo || !password || !fechaNacimiento || !telefono) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
      const user = userCredential.user;

      // Guardar info adicional en Firestore (colección "usuarios")
      await setDoc(doc(db, 'usuarios', user.uid), {
        nombre,
        correo,
        fechaNacimiento,
        telefono,
        rol: 'usuario',
        creadoEn: new Date(),
      });

      Alert.alert('Registro exitoso', 'Usuario creado correctamente', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro</Text>

      <TextInput
        placeholder="Nombre"
        value={formulario.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Correo"
        value={formulario.correo}
        onChangeText={(text) => handleChange('correo', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        value={formulario.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        value={formulario.fechaNacimiento}
        onChangeText={(text) => handleChange('fechaNacimiento', text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Teléfono"
        value={formulario.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
        keyboardType="phone-pad"
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.boton} onPress={handleRegistro}>
        <Text style={styles.botonTexto}>Registrarse</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 20, textAlign: 'center' }}>¿Ya tienes cuenta?</Text>
      <TouchableOpacity style={styles.botonLogin} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.botonTexto}>Ir a Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonLogin: {
    backgroundColor: '#ccc',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'white',
    fontSize: 18,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});
