import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/menuStyles'; // Importa los estilos separados

export default function MenuPrincipal({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OtraPantalla')} // si tienes más pantallas
      >
        <Text style={styles.buttonText}>Ir a otra pantalla</Text>
      </TouchableOpacity>
    </View>
  );
}