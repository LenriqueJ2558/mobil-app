import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MisReportesScreen from '../screens/MisReportesScreen';
import ActualizarIncidenciaScreen from '../screens/ActualizarIncidenciaScreen';

const Stack = createStackNavigator();

export default function ReportesStack() {
  return (
    <Stack.Navigator initialRouteName="MisReportes">
      <Stack.Screen name="MisReportes" component={MisReportesScreen} />
      <Stack.Screen
        name="ActualizarIncidencia"
        component={ActualizarIncidenciaScreen}
        options={{ title: 'Actualizar Incidencia' }}
      />
    </Stack.Navigator>
  );
}