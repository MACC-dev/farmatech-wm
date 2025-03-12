import sqlalchemy as sql 
import sqlalchemy.ext.declarative as dec
import sqlalchemy.orm as orm

DATABASE_URI = 'sqlite:///./database.db'

engine = sql.create_engine(DATABASE_URI, echo=True, connect_args={'check_same_thread': False})
Session = orm.sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = dec.declarative_base()
