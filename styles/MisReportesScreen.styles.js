import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#F9FAFB', // Fondo gris claro moderno
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827', // Gris oscuro profesional
    marginBottom: 16,
  },
  grupo: {
    marginBottom: 32,
  },
  fecha: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981', // Verde moderno
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reporteItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#34D399', // Verde vibrante
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#4B5563', // Gris neutro
    marginBottom: 10,
    lineHeight: 20,
  },
  hora: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  base: {
    fontSize: 13,
    color: '#10B981',
    marginTop: 6,
    fontWeight: '600',
  },
  spinner: {
    marginTop: 40,
  },
  filtroToggleButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  filtroToggleText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  filtroContainer: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
  },
  tituloFiltro: {
    fontSize: 14,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 8,
  },
  opcionFiltro: {
    fontSize: 13,
    paddingVertical: 4,
    color: '#065F46',
  },
});