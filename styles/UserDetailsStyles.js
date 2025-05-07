import { StyleSheet } from 'react-native';

const UserDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    backgroundColor: '#e8f5e9', // verde claro de fondo
    padding: 10,
    borderRadius: 8,
    color: '#1b5e20',
  },
  input: {
    borderWidth: 1,
    borderColor: '#a5d6a7', // borde verde claro
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#f1f8e9', // verde muy claro
    color: '#1b5e20',
  },
});

export default UserDetailsStyles;