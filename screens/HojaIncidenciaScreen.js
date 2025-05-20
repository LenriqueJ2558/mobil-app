import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, Image,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import styles from '../styles/HojaIncidenciaStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HojaIncidenciaScreen() {
  const [nombreCliente, setNombreCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        const nombreGuardado = await AsyncStorage.getItem('nombre');
        if (nombreGuardado) {
          setNombreCliente(nombreGuardado);
        }
      } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
      }

      getLocation();
    };

    obtenerDatosIniciales();
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
    if (!nombreCliente || !descripcion || !location || !photo || !video) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_cliente', nombreCliente);
    formData.append('descripcion', descripcion);
    formData.append('latitud', location.latitude.toString());
    formData.append('longitud', location.longitude.toString());

    formData.append('foto', {
      uri: photo,
      type: 'image/png',
      name: photo.split('/').pop(),
    });

    formData.append('video', {
      uri: video,
      type: 'video/mp4',
      name: video.split('/').pop(),
    });

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No se encontró token de autenticación. Por favor inicie sesión.');
        return;
      }

      const response = await axios.post('http://192.168.1.20:3003/api/mobile/novedades', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      Alert.alert('Novedad Enviada', 'Los datos se han registrado correctamente.');
      limpiarCampos();
    } catch (error) {
      console.error('Error al enviar la novedad:', error);
      Alert.alert('Error', 'Hubo un problema al enviar la novedad.');
    }
  };

  const limpiarCampos = async () => {
    const nombreGuardado = await AsyncStorage.getItem('nombre');
    setNombreCliente(nombreGuardado || '');
    setDescripcion('');
    setLocation(null);
    setPhoto(null);
    setVideo(null);
    getLocation();
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
        <Text style={styles.label}>Nombre del Serenazgo:</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={nombreCliente}
          editable={false}
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
              source={{ uri: video }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              isLooping={false}
              style={{ width: '100%', height: 200, marginTop: 10 }}
              useNativeControls={true}
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