
FROM node:18 AS frontend
WORKDIR /app
COPY farmacia-react/ ./farmacia-react
WORKDIR /app/farmacia-react
RUN npm install && npm run build

# construir el backend con FastAPI
FROM python:3.11

# Crear y activar entorno
WORKDIR /app

# Copiar backend y requerimientos
COPY backend-FastApi/ ./backend-FastApi
COPY --from=frontend /app/farmacia-react/build ./farmacia-react/build


# Instalar dependencias
RUN pip install --upgrade pip
RUN pip install -r backend-FastApi/requirements.txt


EXPOSE 8000

# Comando de inicio
CMD ["uvicorn", "backend-FastApi.main:app", "--host", "0.0.0.0", "--port", "8000"]
