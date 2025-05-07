import axios from 'axios';

const API_URL = 'http://192.168.16.246:3003/api';

export const login = async (correo, contraseña) => {
  const response = await axios.post(`${API_URL}/auth/signin`, {
    Correo: correo,
    Contraseña: contraseña,
  });
  return response.data;
};
