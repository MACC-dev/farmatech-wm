import React from 'react';
import Swal from 'sweetalert2';
import '../Styles/sideMenu.css';

const SideMenu = () => {
    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: '¿Estás seguro de que deseas cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
    };

    return (
        <nav className="main-menu">
            <ul>
                <li>
                    <a href="/home">
                        <i className="fa fa-home fa-2x"></i>
                        <span className="nav-text">
                            Home
                        </span>
                    </a>
                </li>
                <li className="has-subnav">
                    <a href="/storage">
                        <i className="fa fa-globe fa-2x"></i>
                        <span className="nav-text">
                            Inventario
                        </span>
                    </a>
                </li>
                <li className="has-subnav">
                    <a href="/store">
                        <i className="fa fa-brands fa-shopify fa-2x"></i>
                        <span className="nav-text">
                            Ventas
                        </span>
                    </a>
                </li>
                <li className="has-subnav">
                    <a href="/dashboard">
                        <i className="fa fa-solid fa-chart-line fa-2x"></i>
                        <span className="nav-text">
                            Dashboard
                        </span>
                    </a>
                </li>
            </ul>

            <ul className="logout">
                <li>
                    <a href="/login" onClick={handleLogout}>
                        <i className="fa fa-power-off fa-2x"></i>
                        <span className="nav-text">
                            Logout
                        </span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default SideMenu;