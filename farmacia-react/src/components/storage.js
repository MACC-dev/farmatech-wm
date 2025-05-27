import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SideMenu from './sideMenu';
import '../Styles/sideMenu.css';
import '../Styles/table.css';
import api from '../api';

const Storage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        producto: '',
        cantidad: '',
        Precio: '',
        Proveedor: '',
        FechadeVencimiento: null
    });
    const [data, setData] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    const fetchProductos = async () => {
        try {
            const response = await api.get('/productos/');
            setData(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const fetchProveedores = async () => {
        try {
            const response = await api.get('/proveedores/');
            setProveedores(response.data);
        } catch (error) {
            console.error('Error al obtener los proveedores:', error);
        }
    };

    useEffect(() => {
        fetchProductos();
        fetchProveedores();
    }, []);

    const handleEdit = (item) => {
        setFormData({
            id: item.ProductoID,
            producto: item.Nombre,
            cantidad: item.Cantidad,
            Precio: item.Precio,
            Proveedor: item.ProveedorID,
            FechadeVencimiento: new Date(item.FechaVencimiento)
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/productos/${id}`);
            setData(data.filter(item => item.ProductoID !== id));
            fetchProductos();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prevState => ({
            ...prevState,
            FechadeVencimiento: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                Nombre: formData.producto,
                Cantidad: parseInt(formData.cantidad),
                Precio: parseFloat(formData.Precio),
                ProveedorID: parseInt(formData.Proveedor),
                FechaVencimiento: formData.FechadeVencimiento.toISOString().split('T')[0]
            };

            let response;

            if (formData.id) {
                response = await api.put(`/productos/${formData.id}`, {
                    ProductoID: formData.id,
                    ...payload
                });
                setData(data.map(item => (item.ProductoID === formData.id ? response.data : item)));
            } else {
                response = await api.post('/productos/', payload);
                setData([...data, response.data]);
            }

            fetchProductos();
            setIsModalOpen(false);
            setFormData({
                id: '',
                producto: '',
                cantidad: '',
                Precio: '',
                Proveedor: '',
                FechadeVencimiento: null
            });
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = data.filter(item =>
        item.Nombre && item.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="area">
                <h1 className='inventario'>Inventario</h1>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-bar"
                    />
                    <button
                        className="add-product"
                        onClick={() => {
                            setFormData({
                                id: '',
                                producto: '',
                                cantidad: '',
                                Precio: '',
                                Proveedor: '',
                                FechadeVencimiento: null
                            });
                            setIsModalOpen(true);
                        }}
                    >
                        Agregar Producto
                    </button>
                </div>
                <div className="table-container">
                    <table id="keywords" cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                <th><span>Id</span></th>
                                <th><span>Producto</span></th>
                                <th><span>Cantidad</span></th>
                                <th><span>Precio</span></th>
                                <th><span>Proveedor</span></th>
                                <th><span>Fecha de Vencimiento</span></th>
                                <th><span>Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(item => (
                                <tr key={item.ProductoID} className={new Date(item.FechaVencimiento) < new Date() ? 'expired' : ''}>
                                    <td>{item.ProductoID}</td>
                                    <td className="lalign">{item.Nombre}</td>
                                    <td>{item.Cantidad}</td>
                                    <td>{item.Precio}</td>
                                    <td>{item.ProveedorID}</td>
                                    <td>{item.FechaVencimiento}</td>
                                    <td>
                                        <button className='editInv' onClick={() => handleEdit(item)}>Edit</button>
                                        <button className='deleteInv' onClick={() => handleDelete(item.ProductoID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <SideMenu />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2 className='Edit'>{formData.id ? 'Editar Producto' : 'Agregar Producto'}</h2>
                        <form onSubmit={handleSubmit}>
                            {formData.id && (
                                <label>
                                    ID:
                                    <input type="text" name="id" value={formData.id} disabled />
                                </label>
                            )}
                            <label>
                                Producto:
                                <input type="text" name="producto" value={formData.producto} onChange={handleChange} />
                            </label>
                            <label>
                                Cantidad:
                                <input type="text" name="cantidad" value={formData.cantidad} onChange={handleChange} />
                            </label>
                            <label>
                                Precio:
                                <input type="text" name="Precio" value={formData.Precio} onChange={handleChange} />
                            </label>
                            <label>
                                Proveedor:
                               <select
                                    name="Proveedor"
                                    value={formData.Proveedor}
                                    onChange={handleChange}
                                    className="select-proveedor">
                                    <option value="">Seleccione un proveedor</option>
                                    {proveedores.map(proveedor => (
                                        <option key={proveedor.ProveedorID} value={proveedor.ProveedorID}>
                                            {proveedor.Nombre}
                                         </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Fecha de Vencimiento:
                                <DatePicker
                                    selected={formData.FechadeVencimiento}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    className="date-picker"
                                />
                            </label>
                            <button type="submit">Guardar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Storage;
