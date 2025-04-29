import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/login'; // Cambiado a 'login'
import Home from './components/home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Dashboard from './components/dashboard';
import Store from './components/store';
import Storage from './components/storage';
import Registrarse from './components/registrarse';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/store" element={<Store />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/registrarse" element={<Registrarse />} />


      </Routes>
    </Router>
);