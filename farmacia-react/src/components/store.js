import React, { useState } from 'react';
import SideMenu from './sideMenu';
import '../Styles/sideMenu.css';
import '../Styles/store.css'; // Importa el nuevo archivo CSS

const Store = () => {
    const [sales, setSales] = useState([]);
    const [inventory, setInventory] = useState([
        { id: 1, producto: 'Paracetamol', cantidad: 1000, Precio: 100 },
        { id: 2, producto: 'Ibuprofeno', cantidad: 800, Precio: 80 },
        { id: 3, producto: 'Aspirina', cantidad: 600, Precio: 60 }
    ]);
    const [saleData, setSaleData] = useState({
        producto: '',
        cantidad: '',
        Precio: ''
    });

    const handleSaleChange = (e) => {
        const { name, value } = e.target;
        setSaleData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaleSubmit = (e) => {
        e.preventDefault();
        const product = inventory.find(item => item.producto === saleData.producto);
        if (product && product.cantidad >= saleData.cantidad) {
            const newSale = {
                ...saleData,
                total: saleData.cantidad * saleData.Precio
            };
            setSales([...sales, newSale]);
            setInventory(inventory.map(item =>
                item.producto === saleData.producto
                    ? { ...item, cantidad: item.cantidad - saleData.cantidad }
                    : item
            ));
            alert('Venta registrada con éxito');
        } else {
            alert('Cantidad insuficiente en inventario');
        }
    };

    return (
        <div className="store-container">
            <SideMenu />
            <div className="area">
                <h1>Registro de Ventas</h1>
                <form onSubmit={handleSaleSubmit}>
                    <label>
                        Producto:
                        <input type="text" name="producto" value={saleData.producto} onChange={handleSaleChange} required />
                    </label>
                    <label>
                        Cantidad:
                        <input type="number" name="cantidad" value={saleData.cantidad} onChange={handleSaleChange} required />
                    </label>
                    <label>
                        Precio:
                        <input type="number" name="Precio" value={saleData.Precio} onChange={handleSaleChange} required />
                    </label>
                    <button type="submit">Registrar Venta</button>
                </form>

                <h2>Facturación</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale, index) => (
                                <tr key={index}>
                                    <td>{sale.producto}</td>
                                    <td>{sale.cantidad}</td>
                                    <td>{sale.Precio}</td>
                                    <td>{sale.total}</td>
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