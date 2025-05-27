import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2ecc71',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  micIcon: {
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  media: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonSend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonClear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#fff',        // fondo blanco
    borderWidth: 1,                 // borde fino
    borderColor: '#ccc',            // color borde gris claro
    borderRadius: 8,                // bordes redondeados
    paddingVertical: 10,            // espacio arriba y abajo
    paddingHorizontal: 12,          // espacio lateral
    fontSize: 16,
    color: '#333',
    //width: '100%',  // opcional, para que ocupe todo el ancho
  },
});
