import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Dashboard from './components/dashboard';
import Storage from './components/storage';
import Store from './components/store';
import './App.css';
import Login from './components/login';
import Registrarse from './components/registrarse';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/store" element={<Store />} />
        <Route path="/" element={<Login />} />
        <Route path="/registrarse" element={<Registrarse />} />
      </Routes>
    </div>
  );
}

export default App;