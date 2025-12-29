# TaskFlow Backend

Este es el backend para la aplicación de gestión de proyectos TaskFlow, construido con **Node.js**, **Express**, **Sequelize** y **PostgreSQL**.

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y ejecutándose.

## Configuración y Ejecución

El proyecto está contenerizado para facilitar el desarrollo. No necesitas instalar Node.js o PostgreSQL localmente si usas Docker.

### 1. Iniciar la aplicación

Desde la raíz del proyecto (donde está el archivo `docker-compose.yml`), ejecuta:

```bash
docker compose up -d --build
```

Esto levantará los siguientes servicios:

- **db**: Base de datos PostgreSQL.
- **backend**: Servidor API en `http://localhost:3001`.
- **frontend**: Cliente React en `http://localhost:3000`.

### 2. Verificar estado

Para ver los logs del backend y asegurarte de que todo está funcionando, usa:

```bash
docker compose logs -f backend
```

Deberías ver un mensaje como `Server is running on port 3001` y `Database synced`.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/         # Configuración de base de datos
│   ├── controllers/    # Lógica de los endpoints
│   ├── middleware/     # Auth, Uploads, etc.
│   ├── models/         # Modelos Sequelize
│   ├── routes/         # Definición de rutas API
│   ├── utils/          # Utilidades
│   ├── app.js          # Configuración de Express
│   └── server.js       # Punto de entrada
├── uploads/            # Archivos subidos (mapeado en volumen)
├── Dockerfile          # Configuración de imagen Docker
└── package.json        # Dependencias
```

## Endpoints Principales

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Proyectos

- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto

### Tareas

- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea

### Métricas

- `GET /api/metrics` - Estadísticas del dashboard

## Variables de Entorno

Las variables de entorno principales están definidas en el `docker-compose.yml`. Para producción o ajustes locales, puedes crear un archivo `.env` en la carpeta backend (basado en `.env.example` si existiera).

Variables clave:

- `PORT`: 3001
- `DATABASE_URL`: URL de conexión a Postgres
- `JWT_SECRET`: Secreto para firmar tokens
