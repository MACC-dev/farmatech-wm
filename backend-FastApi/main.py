import os
from dotenv import load_dotenv


from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Field, Session, create_engine, SQLModel, select, join
from typing import Annotated, Optional, List
import datetime
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

print(f"DB_USER: {db_user}")
print(f"DB_PASSWORD: {db_password}")
print(f"DB_HOST: {db_host}")
print(f"DB_NAME: {db_name}")

url_conection = f'mysql+pymysql://{db_user}:{db_password}@{db_host}:3306/{db_name}'
engine = create_engine(url_conection, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

session_dep = Annotated[Session, Depends(get_session)]

#Definindo o modelo

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
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

@app.get("/")
def index():
    return {"message": "Hello World"}

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