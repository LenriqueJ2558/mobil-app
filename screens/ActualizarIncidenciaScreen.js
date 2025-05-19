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

export default function ActualizarIncidenciaScreen({ route, navigation }) {
  const { incidenciaId } = route.params;

  const [nombreCliente, setNombreCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    
    cargarDatosIncidencia();
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

  const cargarDatosIncidencia = async () => {
    try {
      const response = await axios.get(`http://192.168.16.246:3003/api/mobile/misnovedades/${incidenciaId}`);
      const data = response.data;

      setNombreCliente(data.nombre_cliente);
      setDescripcion(data.descripcion);
      setLocation({ latitude: parseFloat(data.latitud), longitude: parseFloat(data.longitud) });

      // Construimos URLs completos para imagen y video según lo guardado en DB
      const baseUrl = 'http://192.168.16.246:3003/api/uploads';

      const photoUrl = data.foto ? `${baseUrl}/imagenesNovedades/${data.foto}` : null;
      const videoUrl = data.video ? `${baseUrl}/videosNovedades/${data.video}` : null;

      console.log('URL Foto:', photoUrl);
      console.log('URL Video:', videoUrl);

      setPhoto(photoUrl);
      setVideo(videoUrl);
    } catch (error) {
      console.error('Error al cargar la incidencia:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de la incidencia.');
    }
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

  const actualizarNovedad = async () => {
    if (!nombreCliente || !descripcion || !location || !photo || !video) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_cliente', nombreCliente);
    formData.append('descripcion', descripcion);
    formData.append('latitud', location.latitude.toString());
    formData.append('longitud', location.longitude.toString());

    if (photo && photo.startsWith('file://')) {
      formData.append('foto', {
        uri: photo,
        type: 'image/png',
        name: photo.split('/').pop(),
      });
    } else {
      formData.append('foto_url', photo);
    }

    if (video && video.startsWith('file://')) {
      formData.append('video', {
        uri: video,
        type: 'video/mp4',
        name: video.split('/').pop(),
      });
    } else {
      formData.append('video_url', video);
    }

    try {
      const response = await axios.put(`http://192.168.16.246:3003/api/mobile/novedades/${incidenciaId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Incidencia Actualizada', 'Los datos se han actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar la novedad:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar la novedad.');
    }
  };

  const limpiarCampos = () => {
    setNombreCliente('');
    setDescripcion('');
    setLocation(null);
    setPhoto(null);
    setVideo(null);
    getLocation();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Actualizar Incidencia</Text>

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
  source={{ uri: video }}
  rate={1.0}
  volume={1.0}
  isMuted={false}
  resizeMode="contain"
  shouldPlay={false}
  isLooping={false}
  style={{ width: '100%', height: 200, marginTop: 10 }}
  useNativeControls={true}
  onError={error => {
    if (error && error.nativeEvent) {
      console.log('Error en video:', error.nativeEvent.error);
    } else {
      console.log('Error en video:', error);
    }
  }}
/>
          </View>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.buttonSend} onPress={actualizarNovedad}>
          <Icon name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonClear} onPress={limpiarCampos}>
          <Icon name="refresh" size={20} color="#fff" />
          <Text style={styles.buttonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}