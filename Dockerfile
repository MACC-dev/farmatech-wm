# Etapa 1: construir el frontend
FROM node:18 AS frontend
WORKDIR /app
COPY farmacia-react/ ./farmacia-react
WORKDIR /app/farmacia-react
RUN npm install && npm run build

# Etapa 2: construir el backend con FastAPI
FROM python:3.11

# Crear y activar entorno
WORKDIR /app

# Copiar backend y requerimientos
COPY backend-FastApi/ ./backend-FastApi
COPY --from=frontend /app/farmacia-react/build ./backend-FastApi/static

# Instalar dependencias del backend
RUN pip install --upgrade pip
RUN pip install -r backend-FastApi/requirements.txt

# Exponer puertos para el backend (8000) y frontend (3000)
EXPOSE 8000 3000

# Comando de inicio:
# 1. Iniciar el backend FastAPI con uvicorn
# 2. Usar un servidor para servir el frontend (usaremos serve para React)
CMD ["sh", "-c", "uvicorn backend-FastApi.main:app --host 0.0.0.0 --port 8000 & serve -s /app/backend-FastApi/static -l 3000"]
