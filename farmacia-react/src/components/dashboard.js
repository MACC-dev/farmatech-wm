import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchVentasPorFecha, fetchVentasPorProducto, fetchVentasDiarias, fetchProductosMasVendidos } from '../api';
import SideMenu from './sideMenu';
import '../Styles/sideMenu.css';
import '../Styles/dashboard.css';

const Dashboard = () => {
  const [ventasPorFecha, setVentasPorFecha] = useState([]);
  const [ventasPorProducto, setVentasPorProducto] = useState([]);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventasFechaResponse = await fetchVentasPorFecha();
        setVentasPorFecha(ventasFechaResponse.data);

        const ventasProductoResponse = await fetchVentasPorProducto();
        setVentasPorProducto(ventasProductoResponse.data);

        const ventasDiariasResponse = await fetchVentasDiarias();
        setVentasDiarias(ventasDiariasResponse.data);

        const productosMasVendidosResponse = await fetchProductosMasVendidos();
        setProductosMasVendidos(productosMasVendidosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <SideMenu />
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="charts-row">
          <div className="chart-container">
            <h2>Ventas por Fecha</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasPorFecha}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h2>Ventas por Producto</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasPorProducto}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="producto" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff' }} />
                <Legend />
                <Bar dataKey="total" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="charts-row">
          <div className="chart-container">
            <h2>Ventas Diarias</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasDiarias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff' }} />
                <Legend />
                <Bar dataKey="numero_ventas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h2>Productos Más Vendidos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productosMasVendidos}
                  dataKey="cantidad_vendida"
                  nameKey="producto"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {productosMasVendidos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;