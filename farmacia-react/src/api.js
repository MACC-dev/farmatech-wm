import axios from 'axios';

const api = axios.create({
  baseURL: 'https://farmatech-wm-production.up.railway.app/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const fetchVentasPorFecha = () => api.get('/ventas/graficos/');
export const fetchVentasPorProducto = () => api.get('/ventas/por_producto/');
export const fetchVentasDiarias = () => api.get('/ventas/diarias/');
export const fetchProductosMasVendidos = () => api.get('/productos/mas_vendidos/');


export default api;