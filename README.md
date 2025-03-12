# FarmaTech-WM

## Introducción  

FarmaTech es un sistema de información diseñado para la gestión eficiente de farmacias, facilitando el control de inventario, ventas y generación de reportes. Su objetivo principal es mejorar la administración de los productos farmacéuticos, optimizar los procesos de venta y proporcionar análisis de datos en tiempo real.  

Este sistema está desarrollado utilizando **FastAPI** para el backend y **React** para el frontend, garantizando rapidez, seguridad y escalabilidad. Para la gestión de la base de datos, se emplea **MySQL**, permitiendo un almacenamiento estructurado y eficiente.  

> **Nota:** En su primera fase, el sistema está diseñado para ejecutarse de manera local, con la posibilidad de migración futura a una plataforma web accesible desde cualquier ubicación.

---

## Tecnologías Utilizadas  

### Backend  
- Desarrollado con **FastAPI** para garantizar una API rápida y eficiente.  

### Frontend  
- Implementado con **React**, asegurando una experiencia de usuario ágil e interactiva.  

### Base de Datos  
- Uso de **MySQL** con **XAMPP** para el almacenamiento de información.  

### Infraestructura  
- Desarrollo inicial en entorno local con futura migración a **Azure** u otra plataforma cloud.  

---

## Módulos del Sistema  

### 1. Home  
Pantalla principal del sistema donde el usuario accede a los diferentes módulos y visualiza la información general.  

### 2. Inventario  
- Registro de Medicamentos  
- Control de stock  
- Alertas de vencimiento  
- Edición y eliminación de productos  

### 3. Ventas  
- Registro de ventas  
- Facturación  
- Asociación de ventas con inventario  

### 4. Reportes y Gráficas  
- Reportes de ventas diarias, semanales y mensuales  
- Análisis de stock  
- Gráficas de tendencias de ventas y productos más vendidos  

---

## Base de Datos  
El sistema utiliza **MySQL**, proporcionando una estructura eficiente para almacenar y gestionar la información de la farmacia.  

---

## Seguridad y Autenticación  
- Implementación de autenticación mediante **JWT**.  
- Protección de rutas para garantizar un acceso seguro a la información.  
