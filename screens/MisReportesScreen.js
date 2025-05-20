import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/MisReportesScreen.styles';

export default function MisReportesScreen({ navigation }) {
  const [agrupados, setAgrupados] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerFechaFormateada = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  const obtenerHoraFormateada = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  const obtenerEtiquetaFecha = (fechaISO) => {
    const hoy = new Date();
    const fecha = new Date(fechaISO);
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    const esMismaFecha = (f1, f2) =>
      f1.getDate() === f2.getDate() &&
      f1.getMonth() === f2.getMonth() &&
      f1.getFullYear() === f2.getFullYear();

    if (esMismaFecha(fecha, hoy)) {
      return `HOY ${obtenerFechaFormateada(fechaISO)}`;
    } else if (esMismaFecha(fecha, ayer)) {
      return `AYER ${obtenerFechaFormateada(fechaISO)}`;
    } else {
      return obtenerFechaFormateada(fechaISO);
    }
  };

  const agruparPorFecha = (reportes) => {
    const grupos = {};

    reportes.forEach((reporte) => {
      const etiqueta = obtenerEtiquetaFecha(reporte.created_at);
      if (!grupos[etiqueta]) {
        grupos[etiqueta] = [];
      }
      grupos[etiqueta].push(reporte);
    });

    return Object.keys(grupos).sort((a, b) => {
      const fa = new Date(grupos[a][0].created_at);
      const fb = new Date(grupos[b][0].created_at);
      return fb - fa;
    }).map((etiqueta) => ({
      fecha: etiqueta,
      datos: grupos[etiqueta],
    }));
  };

  const obtenerReportes = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get('http://192.168.16.246:3003/api/mobile/misnovedades', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const agrupados = agruparPorFecha(response.data);
      setAgrupados(agrupados);
    } catch (error) {
      console.error('Error al obtener reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerReportes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reportes del Día</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.spinner} />
      ) : (
        <FlatList
          data={agrupados}
          keyExtractor={(item) => item.fecha}
          initialNumToRender={5}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.grupo}>
              <Text style={styles.fecha}>{item.fecha}</Text>
              {item.datos.map((reporte) => (
                <TouchableOpacity
                  key={reporte.id}
                  style={styles.reporteItem}
                  onPress={() =>
                    navigation.navigate('ActualizarIncidencia', { incidenciaId: reporte.id })
                  }
                >
                  <Text style={styles.nombre}>
                    EL NOMBRE ({reporte.nombre_cliente?.toUpperCase()})
                  </Text>
                  <Text style={styles.descripcion}>
                    DESCRIPCION DE LA NOVEDAD{'\n'}({reporte.descripcion})
                  </Text>
                  <Text style={styles.hora}>
                    LA HORA ({obtenerHoraFormateada(reporte.created_at)})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

