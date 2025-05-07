import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/HomeStyles'; // Si quieres separar los estilos aquí también

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido al Dashboard de Administrador</Text>
    </View>
  );
}
