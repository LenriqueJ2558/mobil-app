import { useState } from 'react';
import { login } from '../services/authService';
import '../styles/login.css';
import logo from '../assets/logo.png';

const LoginScreen = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(correo, contraseña);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('Nombre', data.Nombre);
      localStorage.setItem('TipoRol', data.TipoRol);
      window.location.href = '/dashboard/home';
    } catch {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="login-wrapper">
      <img src={logo} alt="logo" className="logo" />
      <form onSubmit={handleLogin} className="form">
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginScreen;
