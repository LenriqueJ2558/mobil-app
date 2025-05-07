import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../styles/DrawerStyles';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.role}>{props.rol}</Text>
        <Text style={styles.user}>{props.nombre}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity onPress={() => props.navigation.navigate('SubGerencia')}>
          <Text style={styles.item}>Sub Gerencia</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('CIEM')}>
          <Text style={styles.item}>CIEM</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Reportes')}>
          <Text style={styles.item}>Reportes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.optionRow}>
            <Icon name="person-add" size={20} />
            <Text style={styles.optionText}>Registrar Usuario</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.optionRow}>
            <Icon name="information-circle" size={20} />
            <Text style={styles.optionText}>Detalles del Usuario</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.optionRow}>
            <Icon name="people" size={20} />
            <Text style={styles.optionText}>Lista de Usuarios</Text>
          </View>
        </TouchableOpacity>
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