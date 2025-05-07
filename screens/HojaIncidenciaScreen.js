import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, Image,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Video } from 'expo-av';  // ✅ Importamos Video de expo-av
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';  // Importamos axios
import styles from '../styles/HojaIncidenciaStyles';

export default function HojaIncidenciaScreen() {
  const [nombreCliente, setNombreCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de ubicación denegado');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) setVideo(result.assets[0].uri);
  };

  const enviarNovedad = async () => {
    // Verificamos que todos los campos estén completos
    if (!nombreCliente || !descripcion || !location || !photo || !video) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_cliente', nombreCliente);
    formData.append('descripcion', descripcion);
    formData.append('latitud', location.latitude.toString());
    formData.append('longitud', location.longitude.toString());

    // Enviar la foto
    formData.append('foto', {
      uri: photo,
      type: 'image/png',  // Ajusta el tipo MIME según el tipo de archivo que estás enviando
      name: photo.split('/').pop(),
    });

    // Enviar el video
    formData.append('video', {
      uri: video,
      type: 'video/mp4',  // Ajusta el tipo MIME según el tipo de archivo que estás enviando
      name: video.split('/').pop(),
    });

    try {
      const response = await axios.post('http://192.168.16.246:3003/api/mobile/novedades', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      Alert.alert('Novedad Enviada', 'Los datos se han registrado correctamente.');
    } catch (error) {
      console.error('Error al enviar la novedad:', error);
      Alert.alert('Error', 'Hubo un problema al enviar la novedad.');
    }
  };

  const limpiarCampos = () => {
    setNombreCliente('');
    setDescripcion('');
    setLocation(null);
    setPhoto(null);
    setVideo(null);
    getLocation(); // Obtener nueva ubicación
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hoja de Incidencias</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Ubicación GPS:</Text>
        {location ? (
          <Text>{`Lat: ${location.latitude}, Lon: ${location.longitude}`}</Text>
        ) : (
          <Text>Obteniendo ubicación...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Nombre del Cliente:</Text>
        <TextInput
          style={styles.input}
          value={nombreCliente}
          onChangeText={setNombreCliente}
          placeholder="Ej: Juan Pérez"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Descripción del Incidente:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Describe lo que ocurrió..."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Foto:</Text>
        <Button title="Seleccionar Foto" onPress={pickImage} />
        {photo && <Image source={{ uri: photo }} style={styles.media} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Video:</Text>
        <Button title="Seleccionar Video" onPress={pickVideo} />
        {video && (
          <View style={styles.media}>
            <Video
              source={{ uri: video }} // Aquí es donde reproducimos el video
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              isLooping={false}
              style={{ width: '100%', height: 200, marginTop: 10 }}
              useNativeControls={true}  // Activamos los controles nativos del video
            />
          </View>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.buttonSend} onPress={enviarNovedad}>
          <Icon name="send" size={20} color="#fff" />
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonClear} onPress={limpiarCampos}>
          <Icon name="refresh" size={20} color="#fff" />
          <Text style={styles.buttonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}