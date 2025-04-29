import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gif from '../recourses/brain-16580_256.gif';
import '../Styles/login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Resetear el error

    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email, // Cambia esto si usas NombreUsuario en lugar de email
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }

      const data = await response.json();
      console.log('Token de acceso:', data.access_token);
      // Aquí puedes guardar el token en el almacenamiento local o en el contexto
      localStorage.setItem('access_token', data.access_token);
      navigate('/home'); // Redirige a la página de inicio después del inicio de sesión
    } catch (error) {
      console.error('Error:', error);
      setError(error.message); // Muestra un mensaje de error al usuario
    }
  };

  return (
    <div className="position">
      <canvas id="svgBlob"></canvas>
      <form className="container" onSubmit={handleLogin}>
        <div className="centering-wrapper">
          <div className="section1 text-center">
            <div className="primary-header">Bienvenido de Vuelta!</div>
            <div className="secondary-header">Estamos encantados de tenerte de Vuelta!</div>
            <div className="input-position">
              <div className="form-group">
                <h5 className="input-placeholder" id="email-txt">Email<span className="error-message" id="email-error"></span></h5>
                <input
                  type="email"
                  required
                  name="logemail"
                  className="form-style"
                  id="logemail"
                  autoComplete="off"
                  style={{ marginBottom: '20px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <i className="input-icon uil uil-at"></i>
              </div>
              <div className="form-group">
                <h5 className="input-placeholder" id="pword-txt">Password<span className="error-message" id="password-error"></span></h5>
                <input
                  type="password"
                  required
                  name="logpass"
                  className="form-style"
                  id="logpass"
                  autoComplete="on"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i className="input-icon uil uil-lock-alt"></i>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="password-container"><a href="/password" className="link">Olvidaste tu contraseña?</a></div>
            <div className="btn-position">
              <button type="submit" className="btn">Login</button>
            </div>
            <div className="footer">No tienes una cuenta? <a href="/registrarse" className="link">Registrate</a></div>
          </div>
          <div className="horizontalSeparator"></div>
          <div className="qr-login">
            <div className="qr-container">
              <img className="logo" src={gif} alt="QR Code" />
              <canvas id="qr-code"></canvas>
            </div>
            <div className="qr-pheader">FarmaTech</div>
            <div className="qr-sheader">La mejor <strong>FARMACIA</strong> del pais.</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;