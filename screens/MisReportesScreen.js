import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function MisReportesScreen({ navigation }) {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false); // 🆕 Estado para la carga

  const obtenerReportes = async () => {
    setLoading(true); // ⏳ Inicia la carga
    try {
      const response = await axios.get('http://192.168.16.246:3003/api/mobile/misnovedades');
      setReportes(response.data);
    } catch (error) {
      console.error('Error al obtener reportes:', error);
    } finally {
      setLoading(false); // ✅ Finaliza la carga
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerReportes();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reporteItem}
      onPress={() => navigation.navigate('ActualizarIncidencia', { incidenciaId: item.id })}
    >
      <Text style={styles.titulo}>{item.nombre_cliente}</Text>
      <Text style={styles.descripcion}>{item.descripcion}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Reportes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.spinner} />
      ) : (
        <FlatList
          data={reportes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reporteItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    marginTop: 5,
  },
  spinner: {
    marginTop: 50,
  },
});