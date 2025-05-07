import React from 'react';
import { Image, ImageBackground, ScrollView } from 'react-native';
import Login from '../components/Login';
import styles from '../styles/loginStyles';

export default function LoginScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../assets/images/logoMunicipalidad.png')}
          style={styles.logoTop}
        />
        <Login navigation={navigation} />
        <Image
          source={require('../assets/images/logoInferior.png')}
          style={styles.logoBottom}
        />
      </ScrollView>
    </ImageBackground>
  );
}