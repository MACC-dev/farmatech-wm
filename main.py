from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/login")
def login():
    return {"login": "success"}

@app.get("/logout")
def logout():
    return {"logout": "success"}

@app.get("/register")
def register():
    return {"register": "success"}