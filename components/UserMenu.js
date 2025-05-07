import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function UserMenu({ onLogout }) {
  return (
    <View style={styles.menu}>
      <Text style={styles.text}>Luis Enrique Campos Juarez</Text>
      <TouchableOpacity onPress={() => {}}><Text style={styles.option}>Registrar Usuario</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => {}}><Text style={styles.option}>Detalles del Usuario</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => {}}><Text style={styles.option}>Lista de Usuarios</Text></TouchableOpacity>
      <TouchableOpacity onPress={onLogout}><Text style={styles.logout}>Cerrar Sesión</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { padding: 20, backgroundColor: '#fff' },
  text: { fontWeight: 'bold', marginBottom: 10 },
  option: { marginVertical: 5, color: '#333' },
  logout: { marginTop: 10, color: 'red' },
});