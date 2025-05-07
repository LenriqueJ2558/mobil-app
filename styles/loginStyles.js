import { StyleSheet } from 'react-native';

const loginStyles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoTop: {
    width: 250,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop: -10,
  },
  loginBox: {
    width: '100%',
    backgroundColor: '#1c6e45', // Fondo verde del formulario
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: -60,
  },
  logoCenter: {
    width: 110,
    height: 110,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 15,
    fontSize: 14,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  eyeIcon: {
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#0d4e30', // Botón verde oscuro
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    color: '#ccc',
    marginTop: 20,
    fontSize: 12,
  },
  logoBottom: {
    width: 300,
    height: 200,
    marginTop: -70,
    resizeMode: 'contain',
  },
});

export default loginStyles;