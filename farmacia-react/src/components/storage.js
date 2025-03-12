import React, { useState, useEffect } from 'react';
import SideMenu from './sideMenu';
import '../Styles/sideMenu.css';
import '../Styles/table.css';

const Storage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        producto: '',
        cantidad: '',
        Precio: '',
        Proveedor: '',
        FechadeVencimiento: ''
    });
    const [data] = useState([
        {
            id: 1,
            producto: 'Paracetamol',
            cantidad: '1000',
            Precio: '100',
            Proveedor: '10%',
            FechadeVencimiento: '2025-12-31'
        },
        {
            id: 2,
            producto: 'Ibuprofeno',
            cantidad: '800',
            Precio: '80',
            Proveedor: '10%',
            FechadeVencimiento: '2024-11-30'
        },
        {
            id: 3,
            producto: 'Aspirina',
            cantidad: '600',
            Precio: '60',
            Proveedor: '10%',
            FechadeVencimiento: '2023-10-15'
            
        }
    ]);

    useEffect(() => {
        // consultar data
    }, []);

    const handleEdit = (item) => {
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        //delete data
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //update data
    };

    return (
        <div>
            <div className="area">
                <h1 className='inventario'>Inventario</h1>
                <div className="table-container">
                    <table id="keywords" cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                <th><span>Producto</span></th>
                                <th><span>Cantidad</span></th>
                                <th><span>Precio</span></th>
                                <th><span>Proveedor</span></th>
                                <th><span>Fecha de Vencimiento</span></th>
                                <th><span>Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id} className={new Date(item.FechadeVencimiento) < new Date() ? 'expired' : ''}>
                                    <td className="lalign">{item.producto}</td>
                                    <td>{item.cantidad}</td>
                                    <td>{item.Precio}</td>
                                    <td>{item.Proveedor}</td>
                                    <td>{item.FechadeVencimiento}</td>
                                    <td>
                                        <button className='editInv' onClick={() => handleEdit(item)}>Edit</button>
                                        <button className='deleteInv' onClick={() => handleDelete(item.id)}>Delete</button>
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
                        <h2 className='Edit'>Editar Producto</h2>
                        <form onSubmit={handleSubmit}>
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
                                <input type="text" name="Proveedor" value={formData.Proveedor} onChange={handleChange} />
                            </label>
                            <label>
                                Fecha de Vencimiento:
                                <input type="text" name="FechadeVencimiento" value={formData.FechadeVencimiento} onChange={handleChange} />
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