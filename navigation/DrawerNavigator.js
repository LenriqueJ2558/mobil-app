import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MenuPrincipal from '../components/MenuPrincipal';
import HomeScreen from '../screens/HomeScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ nombre, rol }) {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} nombre={nombre} rol={rol} />
      )}
    >
      <Drawer.Screen name="Inicio" component={MenuPrincipal} />
      <Drawer.Screen name="SubGerencia" component={HomeScreen} />
      <Drawer.Screen name="CIEM" component={HomeScreen} />
      <Drawer.Screen name="Reportes" component={HomeScreen} />
    </Drawer.Navigator>
  );
}