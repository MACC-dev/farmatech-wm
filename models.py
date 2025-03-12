import datetime as dt
import sqlalchemy as sql
import sqlalchemy.ext.declarative as dec
import sqlalchemy.orm as orm
import passlib.hash as ph
import database as db

class User(db.base):
    __tablename__ = 'users'
    iduser = sql.Column(sql.Integer, primary_key=True, autoincrement=True, unique=True , nullable=False)
    email = sql.Column(sql.String, unique=True)
    username = sql.Column(sql.String, unique=True)
    hashed_password = sql.Column(sql.String)
    created_at = sql.Column(sql.DateTime, default=dt.datetime.utcnow)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password = ph.bcrypt.hash(password)

    def check_password(self, password):
        return ph.bcrypt.verify(password, self.password)

class Medicamento(db.base):
    __tablename__ = 'medicamentos'
    idmedicamento = sql.Column(sql.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    nombremed = sql.Column(sql.String, unique=True)
    descripcion = sql.Column(sql.String)
    precio = sql.Column(sql.Float)
    cantidad = sql.Column(sql.Integer)

    def __repr__(self):
        return f'<Medicamento {self.nombre}>'

class inventario(db.base):
    __tablename__ = 'inventario'
    idinventario = sql.Column(sql.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    idmedicamento = sql.Column(sql.Integer, sql.ForeignKey('medicamentos.idmedicamento'))
    cantidad = sql.Column(sql.Integer)
    created_at = sql.Column(sql.DateTime, default=dt.datetime.utcnow)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

    def __repr__(self):
        return f'<Inventario {self.idinventario}>'
    
class Venta(db.base):
    __tablename__ = 'ventas'
    idventa = sql.Column(sql.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    idmedicamento = sql.Column(sql.Integer, sql.ForeignKey('medicamentos.idmedicamento'))
    iduser = sql.Column(sql.Integer, sql.ForeignKey('users.iduser'))
    cantidad = sql.Column(sql.Integer)
    total = sql.Column(sql.Float)
    created_at = sql.Column(sql.DateTime, default=dt.datetime.utcnow)

    def __repr__(self):
        return f'<Venta {self.idventa}>'