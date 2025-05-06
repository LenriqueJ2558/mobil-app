import React from 'react';
import { ImageBackground, ScrollView, Image } from 'react-native';
import Login from './components/Login'; // Importamos el componente Login
import styles from './styles/loginStyles';

export default function App() {
  return (
    <ImageBackground
      source={require('./assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo superior */}
        <Image
          source={require('./assets/images/logoMunicipalidad.png')}
          style={styles.logoTop}
        />

        {/* Componente de login */}
        <Login />

        {/* Logo inferior */}
        <Image
          source={require('./assets/images/logoInferior.png')}
          style={styles.logoBottom}
        />
      </ScrollView>
    </ImageBackground>
  );
}