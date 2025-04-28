import React, { useState, useEffect } from 'react';
import SideMenu from './sideMenu';
import '../Styles/sideMenu.css';
import '../Styles/store.css';
import api from '../api'; // Importa la instancia de Axios

const Store = () => {
    const [sales, setSales] = useState([]); // Historial de ventas
    const [inventory, setInventory] = useState([]); // Inventario
    const [saleData, setSaleData] = useState({
        producto: '',
        cantidad: ''
    });

    // Obtener el inventario desde el backend
    const fetchInventory = async () => {
        try {
            const response = await api.get('/productos/');
            setInventory(response.data);
        } catch (error) {
            console.error('Error al obtener el inventario:', error);
        }
    };

    const fetchSales = async () => {
        try {
            const response = await api.get('/ventas/');
            // Ordenar las ventas por VentaID de menor a mayor
            const sortedSales = response.data.sort((a, b) => a.VentaID - b.VentaID);
            setSales(sortedSales);
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    };

    useEffect(() => {
        fetchInventory();
        fetchSales();
    }, []);

    const handleSaleChange = (e) => {
        const { name, value } = e.target;
        setSaleData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validar que el producto exista en el inventario
            const product = inventory.find(item => item.ProductoID === parseInt(saleData.producto));
            if (!product) {
                alert('El producto no existe en el inventario');
                return;
            }

            // Validar que haya suficiente cantidad en el inventario
            if (product.Cantidad < parseInt(saleData.cantidad)) {
                alert('Cantidad insuficiente en inventario');
                return;
            }

            // Crear el payload para enviar al backend
            const payload = {
                producto_id: parseInt(saleData.producto),
                cantidad: parseInt(saleData.cantidad)
            };

            console.log('Datos enviados al backend:', payload);

            // Realizar la solicitud al backend
            const response = await api.post('/realizarventa/', payload);

            // Actualizar el inventario y las ventas
            fetchInventory();
            fetchSales();

            // Mostrar mensaje de éxito
            alert(`Venta registrada con éxito: ${response.data.message}`);
        } catch (error) {
            console.error('Error al registrar la venta:', error);
            alert('Error al registrar la venta');
        }
    };

    return (
        <div className="store-container">
            <SideMenu />
            <div className="area">
                <h1>Registro de Ventas</h1>
                <form onSubmit={handleSaleSubmit}>
                    <label>
                        ID Producto:
                        <input
                            type="number"
                            name="producto"
                            value={saleData.producto}
                            onChange={handleSaleChange}
                            required
                        />
                    </label>
                    <label>
                        Cantidad:
                        <input
                            type="number"
                            name="cantidad"
                            value={saleData.cantidad}
                            onChange={handleSaleChange}
                            required
                        />
                    </label>
                    <button type="submit">Registrar Venta</button>
                </form>

                <h2>Registro de Facturación</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>ID Venta</th>
                                <th>Fecha</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale, index) => (
                                <tr key={index}>
                                    <td>{sale.ProductoNombre}</td> {/* Mostrar el nombre del producto */}
                                    <td>{sale.VentaID}</td>
                                    <td>{sale.FechaVenta}</td>
                                    <td>{sale.TotalVenta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Store;