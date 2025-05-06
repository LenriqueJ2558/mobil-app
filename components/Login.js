import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import styles from '../styles/loginStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleLogoPress = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.20:3003/api/auth/signin', {
        Correo: correo,
        Contraseña: contraseña,
      });

      const { accessToken, Nombre, TipoRol } = response.data;

      // Guardar en almacenamiento si se desea (AsyncStorage recomendado)
      console.log('Token:', accessToken);
      console.log('Nombre:', Nombre);
      console.log('Rol:', TipoRol);

      Alert.alert('Éxito', 'Inicio de sesión correcto');
      // Aquí puedes navegar a otra pantalla si usas React Navigation
      // navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.loginBox}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Animated.Image
              source={require('../assets/images/logoSerenazgo.png')}
              style={[styles.logoCenter, { transform: [{ rotate: rotateInterpolate }] }]}
            />
          </TouchableOpacity>

          <Text style={styles.title}>GERENCIA DE SEGURIDAD CIUDADANA</Text>

          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo"
            placeholderTextColor="#999"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#999"
              secureTextEntry={!passwordVisible}
              value={contraseña}
              onChangeText={setContraseña}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>Municipalidad de Lurigancho Chosica</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}