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
import API_BASE_URL from '../config/apiConfig';
import { Picker } from '@react-native-picker/picker';

export default function HojaIncidenciaScreen() {
  const [nombreCliente, setNombreCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);

  const [generalNovedad, setGeneralNovedad] = useState('');
  const [tipoNovedad, setTipoNovedad] = useState('');
  const [subTipoNovedad, setSubTipoNovedad] = useState('');
  const [base, setBase] = useState('');
  const [codigo, setCodigo] = useState('');

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
    if (!nombreCliente) {
      Alert.alert('Campo requerido', 'El nombre del serenazgo es obligatorio.');
      return;
    }
  
    if (!descripcion) {
      Alert.alert('Campo requerido', 'La descripción del incidente es obligatoria.');
      return;
    }
  
    if (!location) {
      Alert.alert('Campo requerido', 'No se pudo obtener la ubicación GPS. Intente nuevamente.');
      return;
    }
  
    if (!photo) {
      Alert.alert('Campo requerido', 'Debe seleccionar una foto.');
      return;
    }
  
    if (!video) {
      Alert.alert('Campo requerido', 'Debe seleccionar un video.');
      return;
    }
  
    if (!generalNovedad) {
      Alert.alert('Campo requerido', 'Debe buscar un código válido para completar "General de Novedades".');
      return;
    }
  
    if (!tipoNovedad) {
      Alert.alert('Campo requerido', 'Debe buscar un código válido para completar "Tipo de Novedades".');
      return;
    }
  
    if (!subTipoNovedad) {
      Alert.alert('Campo requerido', 'Debe buscar un código válido para completar "Sub Tipo de Novedades".');
      return;
    }
  
    if (!base || base === "") {
      Alert.alert('Campo requerido', 'Debe seleccionar una Base válida en el campo correspondiente.');
      return;
    }
  
    const formData = new FormData();
    formData.append('nombre_cliente', nombreCliente);
    formData.append('descripcion', descripcion);
    formData.append('latitud', location.latitude.toString());
    formData.append('longitud', location.longitude.toString());
    formData.append('GeneraldeNovedades', generalNovedad);
    formData.append('TipodeNovedades', tipoNovedad);
    formData.append('SubTipoNovedades', subTipoNovedad);
    formData.append('Base', base);
  
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
        Alert.alert('Autenticación', 'No se encontró token de autenticación. Por favor inicie sesión.');
        return;
      }
  
      const response = await axios.post(`${API_BASE_URL}/api/mobile/novedades`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data);
      Alert.alert('Éxito', 'Los datos se han registrado correctamente.');
      limpiarCampos();
    } catch (error) {
      console.error('Error al enviar la novedad:', error);
      Alert.alert('Error', 'Hubo un problema al enviar la novedad. Intente nuevamente.');
    }
  };
  const limpiarCampos = async () => {
    const nombreGuardado = await AsyncStorage.getItem('nombre');
    setNombreCliente(nombreGuardado || '');
    setDescripcion('');
    setLocation(null);
    setPhoto(null);
    setVideo(null);
    setGeneralNovedad('');
    setTipoNovedad('');
    setSubTipoNovedad('');
    setBase('');
    setCodigo('');
    getLocation();
  };

  const buscarPorCodigo = async () => {
    const codigoRegex = /^0\d{5}$/; // Comienza con 0 y tiene 6 dígitos en total
  
    if (!codigoRegex.test(codigo)) {
      Alert.alert('Código inválido', 'El código debe tener 6 dígitos, comenzar con 0 y contener solo números.');
      return;
    }
  
    try {
      const response = await axios.get(`http://192.168.1.20:3003/api/Incidencia/${codigo}`);
      const data = response.data;
  
      console.log('Respuesta completa:', data);
  
      // Verifica si los campos esperados existen en la respuesta
      if (!data || !data.GENERAL || !data.TIPO || !data.SUBTIPO) {
        Alert.alert('No existe ese código', 'No se encontró ninguna incidencia con ese código.');
        return;
      }
  
      setGeneralNovedad(data.GENERAL || '');
      setTipoNovedad(data.TIPO || '');
      setSubTipoNovedad(data.SUBTIPO || '');
  
    } catch (error) {
      console.error('Error al buscar el código:', error);
      Alert.alert('Error', 'Hubo un problema al buscar el código.');
    }
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

      {/* Nuevos campos como texto */}
      <View style={styles.section}>
  <Text style={styles.label}>General de Novedades:</Text>
  <TextInput
    style={[styles.input, { backgroundColor: '#f0f0f0' }]}
    value={generalNovedad}
    editable={false}
    placeholder="General de Novedad"
  />
</View>

<View style={styles.section}>
  <Text style={styles.label}>Tipo de Novedades:</Text>
  <TextInput
    style={[styles.input, { backgroundColor: '#f0f0f0' }]}
    value={tipoNovedad}
    editable={false}
    placeholder="Tipo de Novedad"
  />
</View>

<View style={styles.section}>
  <Text style={styles.label}>Sub Tipo de Novedades:</Text>
  <TextInput
    style={[styles.input, { backgroundColor: '#f0f0f0' }]}
    value={subTipoNovedad}
    editable={false}
    placeholder="Sub Tipo de Novedad"
  />
</View>

      {/* Código con botón */}
      <View style={[styles.section, { flexDirection: 'row', alignItems: 'center' }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Código:</Text>
          <TextInput
  style={styles.input}
  value={codigo}
  onChangeText={(text) => {
    const soloNumeros = text.replace(/[^0-9]/g, '');
    if (soloNumeros.length <= 6) setCodigo(soloNumeros);
  }}
  placeholder="Ej: 012345"
  keyboardType="numeric"
/>
        </View>
        <TouchableOpacity style={[styles.buttonSend, { marginLeft: 10, marginTop: 20 }]} onPress={buscarPorCodigo}>
  <Icon name="search" size={20} color="#fff" />
</TouchableOpacity>
      </View>

      {/* Base sigue siendo Picker */}
      <View style={styles.section}>
        <Text style={styles.label}>Base:</Text>
        <Picker
          selectedValue={base}
          onValueChange={setBase}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una opción..." value="" enabled={false} />
          <Picker.Item label="Base Casco Urbano" value="Base Casco Urbano" />
          <Picker.Item label="Base Huachipa" value="Base Huachipa" />
          <Picker.Item label="Base Ñaña" value="Base Ñaña" />
          <Picker.Item label="Base Carapongo" value="Base Carapongo" />
          <Picker.Item label="Base Jicamarca" value="Base Jicamarca" />
          <Picker.Item label="Base Campiña" value="Base Campiña" />
          <Picker.Item label="Base Niveria" value="Base Niveria" />
          <Picker.Item label="Base Cajamarquilla" value="Base Cajamarquilla" />
        </Picker>
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