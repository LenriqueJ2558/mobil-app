import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0FDF4', // Verde claro de fondo
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#065F46', // Verde oscuro
    marginBottom: 20,
  },
  grupo: {
    marginBottom: 32,
  },
  fecha: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857', // Verde medio
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
    paddingBottom: 6,
  },
  reporteItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#10B981', // Borde verde fuerte
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#064E3B',
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  hora: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'right',
  },
  spinner: {
    marginTop: 50,
  },
});
