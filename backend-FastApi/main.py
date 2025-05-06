import os
from dotenv import load_dotenv

import csv
from io import StringIO
import bcrypt
from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import Field, Session, create_engine, SQLModel, select, join
from sqlalchemy import func
from typing import Annotated, Optional, List
import datetime
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from fastapi.responses import  StreamingResponse




load_dotenv()
ACCESS_TOKEN_EXPIRE_MINUTES = 30
ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key") 
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")



url_conection = 'mysql+pymysql://root:OKviUeMMPTDzdVwWgSyXtUqABepCAeMp@shinkansen.proxy.rlwy.net:38422/railway'
engine = create_engine(url_conection, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

session_dep = Annotated[Session, Depends(get_session)]

#Definindo modelo

class Proveedor(SQLModel, table=True):
    ProveedorID: int = Field(default=None, primary_key=True)
    Nombre: str
    Telefono: Optional[str] = None
    Email: Optional[str] = None
    Direccion: Optional[str] = None

class Producto(SQLModel, table=True):
    ProductoID: int = Field(default=None, primary_key=True)
    Nombre: str
    Precio: float
    Cantidad: int
    FechaVencimiento: datetime.date 
    ProveedorID: int = Field(foreign_key="proveedor.ProveedorID")

class Usuario(SQLModel, table=True):
    UsuarioID: int = Field(default=None, primary_key=True)
    NombreUsuario: str = Field(unique=True)
    Contrasena: str
    NombreCompleto: str
    Email: str = Field(unique=True)
    FechaCreacion: datetime.datetime  
    Rol: str

class Venta(SQLModel, table=True):
    VentaID: int = Field(default=None, primary_key=True)
    FechaVenta: datetime.date 
    TotalVenta: float
    UsuarioID: int = Field(foreign_key="usuario.UsuarioID")

class DetalleVenta(SQLModel, table=True):
    DetalleVentaID: int = Field(default=None, primary_key=True)
    VentaID: int = Field(foreign_key="venta.VentaID")
    ProductoID: int = Field(foreign_key="producto.ProductoID")
    CantidadVendida: int
    PrecioUnitario: float
    Subtotal: float

app = FastAPI()

origins = [
    "https://farmatech-wm-zfcn.vercel.app/",
    # Agrega aquí otros orígenes si es necesario
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()

#Rutas para CRUD de Productos


@app.get("/productos/", response_model=List[Producto])
def read_productos(session: session_dep):
    productos = session.exec(select(Producto)).all()
    return productos

@app.post("/productos/", response_model=Producto)
def create_producto(producto: Producto, session: session_dep):
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

@app.put("/productos/{producto_id}", response_model=Producto)
def update_producto(producto_id: int, producto: Producto, session: session_dep):
    db_producto = session.get(Producto, producto_id)
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db_producto.Nombre = producto.Nombre
    db_producto.Precio = producto.Precio
    db_producto.Cantidad = producto.Cantidad
    db_producto.FechaVencimiento = producto.FechaVencimiento
    session.commit()
    return db_producto

@app.delete("/productos/{producto_id}")
def delete_producto(producto_id: int, session: session_dep):
    db_producto = session.get(Producto, producto_id)
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    session.delete(db_producto)
    session.commit()
    return {"message": "Producto eliminado"}

@app.get("/ventas/")
def get_ventas(session: session_dep):
    # Realizar un JOIN entre Venta, DetalleVenta y Producto
    query = (
        select(
            Venta.VentaID,
            Venta.FechaVenta,
            Venta.TotalVenta,
            Producto.Nombre.label("ProductoNombre"),
            DetalleVenta.CantidadVendida,
            DetalleVenta.Subtotal
        )
        .join(DetalleVenta, Venta.VentaID == DetalleVenta.VentaID)
        .join(Producto, DetalleVenta.ProductoID == Producto.ProductoID)
    )
    ventas = session.exec(query).all()

    # Formatear los resultados para incluir el nombre del producto
    return [
        {
            "VentaID": venta.VentaID,
            "FechaVenta": venta.FechaVenta,
            "TotalVenta": venta.TotalVenta,
            "ProductoNombre": venta.ProductoNombre,
            "CantidadVendida": venta.CantidadVendida,
            "Subtotal": venta.Subtotal,
        }
        for venta in ventas
    ]


from pydantic import BaseModel

class VentaRequest(BaseModel):
    producto_id: int
    cantidad: int

@app.post("/realizarventa/")
def realizar_venta(request: VentaRequest, session: session_dep):
    # Obtener los datos de la solicitud
    producto_id = request.producto_id
    cantidad = request.cantidad

    # Validar que el producto exista
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Validar que haya suficiente cantidad en el inventario
    if cantidad > producto.Cantidad:
        raise HTTPException(status_code=400, detail="Cantidad solicitada excede la disponible")

    # Calcular el total de la venta
    total_venta = producto.Precio * cantidad

    # Crear una nueva venta
    nueva_venta = Venta(
        FechaVenta=datetime.date.today(),
        TotalVenta=total_venta,
        UsuarioID=1  # Cambiar según el usuario autenticado
    )
    session.add(nueva_venta)
    session.commit()
    session.refresh(nueva_venta)

    # Crear el detalle de la venta
    detalle_venta = DetalleVenta(
        VentaID=nueva_venta.VentaID,
        ProductoID=producto_id,
        CantidadVendida=cantidad,
        PrecioUnitario=producto.Precio,
        Subtotal=total_venta
    )
    session.add(detalle_venta)

    # Actualizar la cantidad del producto en el inventario
    producto.Cantidad -= cantidad
    session.commit()

    return {
        "message": "Venta realizada con éxito",
        "venta": {
            "VentaID": nueva_venta.VentaID,
            "FechaVenta": nueva_venta.FechaVenta,
            "TotalVenta": nueva_venta.TotalVenta
        },
        "detalle": {
            "DetalleVentaID": detalle_venta.DetalleVentaID,
            "ProductoID": detalle_venta.ProductoID,
            "CantidadVendida": detalle_venta.CantidadVendida,
            "PrecioUnitario": detalle_venta.PrecioUnitario,
            "Subtotal": detalle_venta.Subtotal
        }
    }

@app.get("/ventas/graficos/")
def ventas_por_fecha(session: session_dep):
    # Consulta para agrupar ventas por fecha
    query = (
        select(
            Venta.FechaVenta,
            func.sum(Venta.TotalVenta).label("TotalVentas")
        )
        .group_by(Venta.FechaVenta)
    )
    resultados = session.exec(query).all()

    # Formatear los datos para el frontend
    return [
        {"fecha": str(resultado.FechaVenta), "total": resultado.TotalVentas}
        for resultado in resultados
    ]

@app.get("/ventas/por_producto/")
def ventas_por_producto(session: session_dep):
    query = (
        select(
            Producto.Nombre,
            func.sum(DetalleVenta.Subtotal).label("TotalVentas")
        )
        .join(DetalleVenta, Producto.ProductoID == DetalleVenta.ProductoID)
        .group_by(Producto.Nombre)
    )
    resultados = session.exec(query).all()

    return [
        {"producto": resultado.Nombre, "total": resultado.TotalVentas}
        for resultado in resultados
    ]

@app.get("/ventas/diarias/")
def ventas_diarias(session: session_dep):
    query = (
        select(
            Venta.FechaVenta,
            func.count(Venta.VentaID).label("NumeroVentas")
        )
        .group_by(Venta.FechaVenta)
    )
    resultados = session.exec(query).all()

    return [
        {"fecha": str(resultado.FechaVenta), "numero_ventas": resultado.NumeroVentas}
        for resultado in resultados
    ]

@app.get("/productos/mas_vendidos/")
def productos_mas_vendidos(session: session_dep):
    query = (
        select(
            Producto.Nombre,
            func.sum(DetalleVenta.CantidadVendida).label("CantidadVendida")
        )
        .join(DetalleVenta, Producto.ProductoID == DetalleVenta.ProductoID)
        .group_by(Producto.Nombre)
        .order_by(func.sum(DetalleVenta.CantidadVendida).desc())
    )
    resultados = session.exec(query).all()

    return [
        {"producto": resultado.Nombre, "cantidad_vendida": resultado.CantidadVendida}
        for resultado in resultados
    ]

class UsuarioCreate(BaseModel):
    NombreUsuario: str
    Contrasena: str
    NombreCompleto: str
    Email: EmailStr
    Rol: str

@app.post("/register", response_model=Usuario)
def register_usuario(usuario: UsuarioCreate, session: session_dep):
    # Verificar si el nombre de usuario ya existe
    existing_user = session.exec(
        select(Usuario).where(Usuario.NombreUsuario == usuario.NombreUsuario)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Nombre de usuario ya existe")

    # Verificar si el email ya existe
    existing_email = session.exec(
        select(Usuario).where(Usuario.Email == usuario.Email)
    ).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email ya existe")

    # Hashear la contraseña
    hashed_password = bcrypt.hashpw(usuario.Contrasena.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Crear el nuevo usuario
    new_user = Usuario(
        NombreUsuario=usuario.NombreUsuario,
        Contrasena=hashed_password,
        NombreCompleto=usuario.NombreCompleto,
        Email=usuario.Email,
        FechaCreacion=datetime.datetime.utcnow(),
        Rol=usuario.Rol
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

@app.get("/descargarVentasCSV")
def descargar_ventas_csv(session: session_dep):
    # Ejecutar la query seleccionada
    query = (
        select(
            Venta.VentaID,
            Venta.FechaVenta,
            Venta.TotalVenta,
            Producto.Nombre.label("ProductoNombre"),
            DetalleVenta.CantidadVendida,
            DetalleVenta.Subtotal
        )
        .join(DetalleVenta, Venta.VentaID == DetalleVenta.VentaID)
        .join(Producto, DetalleVenta.ProductoID == Producto.ProductoID)
    )
    ventas = session.exec(query).all()

    # Crear un archivo CSV en memoria
    output = StringIO()
    writer = csv.writer(output)

    # Escribir encabezados en el archivo CSV
    writer.writerow(["VentaID", "FechaVenta", "TotalVenta", "ProductoNombre", "CantidadVendida", "Subtotal"])

    # Escribir los datos de las ventas en el archivo CSV
    for venta in ventas:
        writer.writerow([
            venta.VentaID,
            venta.FechaVenta,
            venta.TotalVenta,
            venta.ProductoNombre,
            venta.CantidadVendida,
            venta.Subtotal
        ])

    # Mover el cursor al inicio del StringIO
    output.seek(0)

    # Retornar el archivo CSV como respuesta
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=ventas.csv"})





# Ruta Principal
@app.get("/")
def root():
    return {"message": "Bienvenido a la API de Inventario"}
    