import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gif from '../recourses/brain-16580_256.gif';
import '../Styles/registrarse.css';
import '../Styles/login.css';

export const Registrarse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NombreUsuario: '',
    Contrasena: '',
    NombreCompleto: '',
    Email: '',
    Rol: 'usuario' 
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar el usuario');
      }

      const data = await response.json();
      console.log('Usuario registrado:', data);
      navigate('/login'); // Redirige al login después del registro
    } catch (error) {
      console.error('Error:', error);
      alert(error.message); // Muestra un mensaje de error al usuario
    }
  };

  return (
    <div className="position">
      <canvas id="svgBlob"></canvas>
      <form className="container" onSubmit={handleRegister}>
        <div className="centering-wrapper">
          <div className="section1 text-center">
            <div className="primary-header">Crea tu Cuenta</div>
            <div className="secondary-header">Únete a FarmaTech y disfruta de nuestros servicios!</div>
            <div className="input-position">
              <div className="form-group">
                <h5 className="input-placeholder" id="username-txt">Nombre de Usuario<span className="error-message" id="username-error"></span></h5>
                <input type="text" required name="NombreUsuario" className="form-style" id="username" autoComplete="off" onChange={handleChange} />
                <i className="input-icon uil uil-user"></i>
              </div>
              <div className="form-group">
                <h5 className="input-placeholder" id="password-txt">Contraseña<span className="error-message" id="password-error"></span></h5>
                <input type="password" required name="Contrasena" className="form-style" id="password" autoComplete="on" onChange={handleChange} />
                <i className="input-icon uil uil-lock-alt"></i>
              </div>
              <div className="form-group">
                <h5 className="input-placeholder" id="fullname-txt">Nombre Completo<span className="error-message" id="fullname-error"></span></h5>
                <input type="text" required name="NombreCompleto" className="form-style" id="fullname" autoComplete="off" onChange={handleChange} />
                <i className="input-icon uil uil-user"></i>
              </div>
              <div className="form-group">
                <h5 className="input-placeholder" id="email-txt">Email<span className="error-message" id="email-error"></span></h5>
                <input type="email" required name="Email" className="form-style" id="email" autoComplete="off" onChange={handleChange} />
                <i className="input-icon uil uil-at"></i>
              </div>
            </div>
            <div className="btn-position">
              <button type="submit" className="btn">Registrarse</button>
            </div>
            <div className="footer">¿Ya tienes una cuenta? <a href="/login" className="link">Inicia Sesión</a></div>
          </div>
          <div className="horizontalSeparator"></div>
          <div className="qr-login">
            <div className="qr-container">
              <img className="logo" src={gif} alt="QR Code" />
              <canvas id="qr-code"></canvas>
            </div>
            <div className="qr-pheader">FarmaTech</div>
            <div className="qr-sheader">La mejor <strong>FARMACIA</strong> del país.</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registrarse;