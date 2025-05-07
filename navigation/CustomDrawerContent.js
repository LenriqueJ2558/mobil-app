import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../styles/DrawerStyles';

export default function CustomDrawerContent(props) {
  const { rol, nombre, navigation } = props;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Header con nombre y rol */}
      <View style={styles.header}>
        <Text style={styles.role}>{rol}</Text>
        <Text style={styles.user}>{nombre}</Text>
      </View>

      {/* Menú superior */}
      <View style={styles.menu}>
        {/* ✅ Visible para todos */}
        <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
          <Text style={styles.item}>Inicio</Text>
        </TouchableOpacity>

        {/* 🔒 Solo para Administrador */}
        {rol === 'Administrador' && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('SubGerencia')}>
              <Text style={styles.item}>Sub Gerencia</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CIEM')}>
              <Text style={styles.item}>CIEM</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ✅ Visible para todos */}
        <TouchableOpacity onPress={() => navigation.navigate('HojaIncidencia')}>
  <Text style={styles.item}>Hoja de Incidencia</Text>
</TouchableOpacity>
      </View>

      {/* Menú inferior */}
      <View style={styles.footer}>
        {/* 🔒 Solo para Administrador */}
        {rol === 'Administrador' && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('AgregarUsuario')}>
              <View style={styles.optionRow}>
                <Icon name="person-add" size={20} />
                <Text style={styles.optionText}>Registrar Usuario</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ListaUsuarios')}>
              <View style={styles.optionRow}>
                <Icon name="people" size={20} />
                <Text style={styles.optionText}>Lista de Usuarios</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* ✅ Visible para todos */}
        <TouchableOpacity onPress={() => navigation.navigate('DetallesUsuario')}>
          <View style={styles.optionRow}>
            <Icon name="information-circle" size={20} />
            <Text style={styles.optionText}>Detalles del Usuario</Text>
          </View>
        </TouchableOpacity>

        {/* 🔴 Cerrar Sesión */}
        <TouchableOpacity onPress={() => props.navigation.replace('Login')}>
          <View style={styles.optionRow}>
            <Icon name="log-out" size={20} color="red" />
            <Text style={[styles.optionText, { color: 'red' }]}>Cerrar Sesión</Text>
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}