import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/MisReportesScreen.styles';
import API_BASE_URL from '../config/apiConfig';

export default function MisReportesScreen({ navigation }) {
  const [reportes, setReportes] = useState([]);
  const [agrupados, setAgrupados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [filtros, setFiltros] = useState({
    base: null,
    desde: null,
    hasta: null,
  });

  const [mostrarDesdePicker, setMostrarDesdePicker] = useState(false);
  const [mostrarHastaPicker, setMostrarHastaPicker] = useState(false);

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

    return Object.keys(grupos)
      .sort((a, b) => {
        const fa = new Date(grupos[a][0].created_at);
        const fb = new Date(grupos[b][0].created_at);
        return fb - fa;
      })
      .map((etiqueta) => ({
        fecha: etiqueta,
        datos: grupos[etiqueta],
      }));
  };

  const obtenerReportes = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/mobile/misnovedades`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReportes(response.data);
      const agrupados = agruparPorFecha(response.data);
      setAgrupados(agrupados);
    } catch (error) {
      console.error('Error al obtener reportes:', error);
    } finally {
      setLoading(false);
    }
  };
  const quitarFiltroFecha = () => {
  const nuevosFiltros = { ...filtros, desde: null, hasta: null };
  setFiltros(nuevosFiltros);
    
  setMostrarDesdePicker(false);
  setMostrarHastaPicker(false); 

  let filtrados = [...reportes];

  if (nuevosFiltros.base) {
    filtrados = filtrados.filter((rep) => rep.Base === nuevosFiltros.base);
  }

  const agrupadosFiltrados = agruparPorFecha(filtrados);
  setAgrupados(agrupadosFiltrados);
};

  const aplicarFiltro = (tipo, valor) => {
    const nuevosFiltros = { ...filtros, [tipo]: valor };
    setFiltros(nuevosFiltros);

    let filtrados = [...reportes];

    if (nuevosFiltros.base) {
      filtrados = filtrados.filter((rep) => rep.Base === nuevosFiltros.base);
    }

    if (nuevosFiltros.desde) {
  const desde = new Date(nuevosFiltros.desde);
  desde.setHours(0, 0, 0, 0); // Inicio del día
  filtrados = filtrados.filter((rep) => new Date(rep.created_at) >= desde);
}

if (nuevosFiltros.hasta) {
  const hasta = new Date(nuevosFiltros.hasta);
  hasta.setHours(23, 59, 59, 999); // Fin del día
  filtrados = filtrados.filter((rep) => new Date(rep.created_at) <= hasta);
}

    const agrupadosFiltrados = agruparPorFecha(filtrados);
    setAgrupados(agrupadosFiltrados);
  };

  const mostrarFecha = (fecha) => {
    return fecha ? obtenerFechaFormateada(fecha) : 'Seleccionar';
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerReportes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  {/* Botón filtro con estilo */}
  <Text style={styles.header}>Reportes del Día</Text>
  <TouchableOpacity
    style={styles.filtroToggleButton}
    onPress={() => setFiltroActivo(!filtroActivo)}
  >
    <Text style={styles.filtroToggleText}>
      {filtroActivo ? 'Ocultar Filtros' : 'Filtrar'}
    </Text>
  </TouchableOpacity>
</View>

{filtroActivo && (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, paddingHorizontal: 10 }}>
    {/* FILTRO BASE */}
    <View style={styles.filtroContainer}>
      <Text style={styles.tituloFiltro}>Filtrar por base:</Text>
      {[
        'Base Casco Urbano',
        'Base Huachipa',
        'Base Ñaña',
        'Base Carapongo',
        'Base Jicamarca',
        'Base Campiña',
        'Base Niveria',
        'Base Cajamarquilla',
      ].map((base) => (
        <TouchableOpacity key={base} onPress={() => aplicarFiltro('base', base)}>
          <Text style={styles.opcionFiltro}>{base}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => aplicarFiltro('base', null)}>
        <Text style={[styles.opcionFiltro, { color: '#DC2626', marginTop: 5 }]}>Quitar filtro de base</Text>
      </TouchableOpacity>
    </View>

    {/* FILTRO FECHA */}
    <View style={styles.filtroContainer}>
      <Text style={styles.tituloFiltro}>Filtrar por fecha:</Text>
      
      <TouchableOpacity onPress={() => {
        setMostrarDesdePicker(true);
        setMostrarHastaPicker(false);
      }}>
        <Text style={styles.opcionFiltro}>Desde: {mostrarFecha(filtros.desde)}</Text>
      </TouchableOpacity>
      {mostrarDesdePicker && (
        <DateTimePicker
          value={filtros.desde ? new Date(filtros.desde) : new Date()}
          mode="date"
          display="compact"  // Cambiado a compact para que se muestre inline si la plataforma lo soporta
          onChange={(event, selectedDate) => {
            setMostrarDesdePicker(false);
            if (selectedDate) {
              aplicarFiltro('desde', selectedDate.toISOString());
            }
          }}
          style={{ width: '100%', marginVertical: 5 }}
        />
      )}

      <TouchableOpacity onPress={() => {
        setMostrarHastaPicker(true);
        setMostrarDesdePicker(false);
      }}>
        <Text style={styles.opcionFiltro}>Hasta: {mostrarFecha(filtros.hasta)}</Text>
      </TouchableOpacity>
      {mostrarHastaPicker && (
        <DateTimePicker
          value={filtros.hasta ? new Date(filtros.hasta) : new Date()}
          mode="date"
          display="compact"  // Cambiado a compact
          onChange={(event, selectedDate) => {
            setMostrarHastaPicker(false);
            if (selectedDate) {
              aplicarFiltro('hasta', selectedDate.toISOString());
            }
          }}
          style={{ width: '100%', marginVertical: 5 }}
        />
      )}

      <TouchableOpacity onPress={quitarFiltroFecha}>
        <Text style={[styles.opcionFiltro, { color: '#DC2626', marginTop: 5 }]}>Quitar filtro de fecha</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

      

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
                    navigation.navigate('ActualizarIncidencia', {
                      incidenciaId: reporte.id,
                    })
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
                  <Text style={styles.base}>BASE ({reporte.Base})</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}