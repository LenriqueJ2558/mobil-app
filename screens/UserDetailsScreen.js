import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/UserDetailsStyles';
import API_BASE_URL from '../config/apiConfig';

export default function UserDetailsScreen() {
  const [userData, setUserData] = useState({ nombre: '', correo: '' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token recuperado:', token);

        if (!token) {
          Alert.alert('Error', 'Token no disponible');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/user-details`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Datos recibidos del backend:', JSON.stringify(data, null, 2));

        // Detectar la estructura del JSON y extraer nombre/correo
        if (data && data.nombre && data.correo) {
          setUserData({ nombre: data.nombre, correo: data.correo });
        } else if (data.user && data.user.nombre && data.user.correo) {
          setUserData({ nombre: data.user.nombre, correo: data.user.correo });
        } else {
          Alert.alert('Error', 'No se pudieron obtener los datos del usuario');
        }
      } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
        Alert.alert('Error', 'No se pudo conectar al servidor');
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token no disponible');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Contraseña actualizada correctamente');
        setNewPassword('');
      } else {
        Alert.alert('Error', 'No se pudo cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      Alert.alert('Error', 'Ocurrió un problema al cambiar la contraseña');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Usuario</Text>

      <Text style={styles.label}>Nombre:</Text>
      <Text style={styles.value}>{userData.nombre || 'Cargando...'}</Text>

      <Text style={styles.label}>Correo:</Text>
      <Text style={styles.value}>{userData.correo || 'Cargando...'}</Text>

      <Text style={styles.label}>Nueva Contraseña:</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Ingrese nueva contraseña"
        secureTextEntry
      />

      <Button title="Cambiar Contraseña" onPress={handlePasswordChange} />
    </View>
  );
}
