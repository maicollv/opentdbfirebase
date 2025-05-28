import React, { useEffect, useState } from "react";
import {View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, Alert, StyleSheet,} from "react-native";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import { app } from "../../firebaseConfig";

export default function Inicio() {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    fecha_nacimiento: "",
    telefono: "",
    rol: "",
  });

  const [nuevaUrl, setNuevaUrl] = useState("");
  const [imagenes, setImagenes] = useState([]);

  // Escuchar el usuario actual
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsuario({ id: user.uid, ...data });
          setForm({
            nombre: data.nombre || "",
            correo: data.correo || "",
            fecha_nacimiento: data.fecha_nacimiento || "",
            telefono: data.telefono || "",
            rol: data.rol || "",
          });
          fetchImagenes(user.uid);
        } else {
          setUsuario(null);
          setImagenes([]);
        }
      } else {
        setUsuario(null);
        setImagenes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Cargar imágenes del usuario
  const fetchImagenes = async (usuarioid) => {
    const q = query(collection(db, "galeria"), where("usuarioid", "==", usuarioid));
    const querySnapshot = await getDocs(q);
    const imgs = [];
    querySnapshot.forEach((doc) => {
      imgs.push({ id: doc.id, ...doc.data() });
    });
    setImagenes(imgs);
  };

  // Actualizar usuario en Firestore
  const handleUpdate = async () => {
    if (!usuario) return;
    try {
      const docRef = doc(db, "usuarios", usuario.id);
      await updateDoc(docRef, form);
      Alert.alert("Éxito", "Datos actualizados");
    } catch (error) {
      Alert.alert("Error", "Error al actualizar");
    }
  };

  // Agregar imagen a galería
  const handleAgregarUrl = async () => {
    if (!nuevaUrl.trim() || !usuario) return;
    try {
      await addDoc(collection(db, "galeria"), {
        url: nuevaUrl,
        usuarioid: usuario.id,
      });
      setNuevaUrl("");
      fetchImagenes(usuario.id);
    } catch (error) {
      Alert.alert("Error", "Error al agregar la imagen");
    }
  };

  // Eliminar imagen de galería
  const handleEliminarImagen = async (id) => {
    try {
      await deleteDoc(doc(db, "galeria", id));
      setImagenes(imagenes.filter((img) => img.id !== id));
    } catch (error) {
      Alert.alert("Error", "Error al eliminar la imagen");
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    setUsuario(null);
    setImagenes([]);
  };

  if (!usuario) return <Text style={styles.cargando}>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Perfil de Usuario</Text>

      <View style={styles.formGroup}>
        <Text>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={form.nombre}
          onChangeText={(text) => setForm((prev) => ({ ...prev, nombre: text }))}
        />
      </View>

      <View style={styles.formGroup}>
        <Text>Correo:</Text>
        <TextInput
          style={styles.input}
          value={form.correo}
          onChangeText={(text) => setForm((prev) => ({ ...prev, correo: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text>Fecha de nacimiento:</Text>
        <TextInput
          style={styles.input}
          value={form.fecha_nacimiento}
          onChangeText={(text) => setForm((prev) => ({ ...prev, fecha_nacimiento: text }))}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.formGroup}>
        <Text>Teléfono:</Text>
        <TextInput
          style={styles.input}
          value={form.telefono}
          onChangeText={(text) => setForm((prev) => ({ ...prev, telefono: text }))}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text>Rol:</Text>
        <TextInput
          style={styles.input}
          value={form.rol}
          onChangeText={(text) => setForm((prev) => ({ ...prev, rol: text }))}
        />
      </View>

      <Button title="Guardar cambios" onPress={handleUpdate} />

      <Text style={[styles.titulo, { marginTop: 20 }]}>Agregar imagen</Text>
      <TextInput
        style={styles.input}
        placeholder="URL de la imagen"
        value={nuevaUrl}
        onChangeText={setNuevaUrl}
      />
      <Button title="Agregar" onPress={handleAgregarUrl} />

      <Text style={[styles.titulo, { marginTop: 20 }]}>Imágenes guardadas</Text>
      <View style={styles.imagenesContainer}>
        {imagenes.map((img) => (
          <View key={img.id} style={styles.imagenItem}>
            <Image
              source={{ uri: img.url }}
              style={styles.imagen}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.btnEliminar}
              onPress={() => handleEliminarImagen(img.id)}
            >
              <Text style={styles.textoEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ marginVertical: 30 }}>
        <Button title="Cerrar sesión" onPress={handleLogout} color="#d9534f" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  cargando: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderColor: "#999",
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  imagenesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imagenItem: {
    marginRight: 10,
    marginBottom: 10,
    width: 100,
    height: 100,
    position: "relative",
  },
  imagen: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  btnEliminar: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  textoEliminar: {
    color: "white",
    fontSize: 12,
  },
});
