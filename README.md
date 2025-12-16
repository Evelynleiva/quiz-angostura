# 🏛️ Sistema de Quiz Interactivo - Museo Angostura del Biobío

Sistema web interactivo de quizzes educativos con códigos QR para mejorar la experiencia de visitantes del Museo Angostura del Biobío.

## 📋 Características Principales

- ✅ **Sistema de Quizzes Interactivos** con temporizador en tiempo real
- ✅ **Códigos QR** para acceso directo desde dispositivos móviles
- ✅ **Sistema de Ranking** con actualización automática de posiciones
- ✅ **Panel de Administración** completo con CRUD de quizzes y preguntas
- ✅ **Imagen Compartible** descargable de resultados (1080x1920px)
- ✅ **Mascota Virtual "Quibar"** como guía interactiva
- ✅ **Diseño Responsive** optimizado para móviles y tablets

## 🛠️ Stack Tecnológico

### Backend
- Node.js 18+
- Express 4.18
- MySQL 8.0
- JWT para autenticación
- bcrypt para hashing de contraseñas
- QRCode para generación de códigos

### Frontend
- React 18
- Vite 5
- React Router 6
- Axios para peticiones HTTP
- html2canvas para captura de imágenes

### Seguridad
- Helmet (headers HTTP seguros)
- express-rate-limit (protección DDoS)
- express-validator (validación de datos)
- CORS configurado

## 📦 Requisitos Previos

Antes de instalar, asegúrate de tener:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** >= 8.0.0

Verificar instalaciones:
```bash
node --version
npm --version
mysql --version
```

## 🚀 Instalación

### 1. Clonar o descargar el proyecto
```bash
# Con Git
git clone <URL_REPOSITORIO>
cd QuizAngostura

# O descargar ZIP y descomprimir
```

### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

Dependencias instaladas:
- express, mysql2, cors, dotenv
- bcrypt, jsonwebtoken, qrcode
- helmet, express-rate-limit, express-validator, hpp

### 3. Instalar dependencias del Frontend
```bash
cd ../frontend
npm install
```

Dependencias instaladas:
- react, react-dom, react-router-dom
- axios, html2canvas

### 4. Configurar Base de Datos

**Crear base de datos:**
```bash
mysql -u root -p
```
```sql
CREATE DATABASE museo_quiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Importar schema:**
```bash
mysql -u root -p museo_quiz < db/museo_quiz.sql
```

### 5. Configurar Variables de Entorno

**Backend (.env):**
```bash
cd backend
cp .env.example .env
notepad .env
```

Editar con tus datos:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=museo_quiz
DB_PORT=3306

JWT_SECRET=cambiar_en_produccion_por_cadena_aleatoria_larga
JWT_EXPIRES_IN=8h

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (.env):**
```bash
cd ../frontend
cp .env.example .env
notepad .env
```
```env
VITE_API_URL=http://localhost:5000/api
```

## ▶️ Ejecutar el Sistema

### Opción 1: Ambos servidores juntos (desde raíz)
```bash
npm run dev
```

### Opción 2: Servidores por separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Servidor en http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Aplicación en http://localhost:5173
```

## 🔐 Acceso Inicial

### Panel de Administración
- URL: `http://localhost:5173/admin`
- Usuario: `admin@museo.cl`
- Contraseña: `Admin123!`

**⚠️ Importante:** Cambiar credenciales después del primer acceso.

### Aplicación de Visitantes
- URL: `http://localhost:5173`

## 📁 Estructura del Proyecto
```
QuizAngostura/
├── backend/
│   ├── config/
│   │   └── database.js          # Conexión MySQL
│   ├── middleware/
│   │   ├── validation.js        # Validaciones express-validator
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── security.js          # Helmet + CORS
│   ├── routes/
│   │   ├── auth.routes.js       # Autenticación admin
│   │   ├── usuarios.routes.js   # Registro usuarios
│   │   ├── quizzes.routes.js    # CRUD quizzes
│   │   ├── sesiones.routes.js   # Sesiones de juego
│   │   ├── ranking.routes.js    # Sistema ranking
│   │   └── qr.routes.js         # Códigos QR
│   ├── .env                     # Variables entorno
│   ├── server.js                # Servidor principal
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Componentes admin
│   │   │   └── common/         # Componentes compartidos
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── QuizList.jsx
│   │   │   ├── QuizPlay.jsx
│   │   │   ├── QuizResultado.jsx
│   │   │   ├── Ranking.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── db/
│   └── museo_quiz.sql          # Schema base de datos
│
└── README.md
```

## 🔌 API Endpoints Principales

### Autenticación
```
POST   /api/auth/login          # Login administrador
```

### Usuarios
```
POST   /api/usuarios/registro   # Registro visitante
GET    /api/usuarios            # Listar usuarios
```

### Quizzes
```
GET    /api/quizzes             # Listar todos
GET    /api/quizzes/:id         # Obtener uno
POST   /api/quizzes             # Crear (admin)
PUT    /api/quizzes/:id         # Actualizar (admin)
DELETE /api/quizzes/:id         # Eliminar (admin)
```

### Sesiones
```
POST   /api/sesiones/iniciar    # Iniciar sesión quiz
POST   /api/sesiones/finalizar/:id  # Finalizar y calcular puntaje
```

### Ranking
```
GET    /api/ranking             # Top ranking general
GET    /api/ranking/:quizId     # Ranking por quiz
```

### Códigos QR
```
GET    /api/qr                  # Listar códigos
POST   /api/qr/generar          # Generar código nuevo
POST   /api/qr/escanear/:codigo # Registrar escaneo
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
**Solución:**
1. Verificar MySQL corriendo: `mysql -u root -p`
2. Revisar credenciales en `.env`
3. Verificar que base de datos existe

### Error: "Port already in use"
**Solución:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Error: "Module not found"
**Solución:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Frontend no carga datos
**Solución:**
1. Verificar backend corriendo en puerto 5000
2. Revisar `VITE_API_URL` en frontend `.env`
3. Verificar CORS en `backend/server.js`

### Error de encoding (caracteres raros)
**Solución:**
1. Verificar charset BD: `utf8mb4`
2. En conexión MySQL: `charset: 'utf8mb4'`

## 🔒 Seguridad Implementada

- ✅ **Helmet** - Headers HTTP seguros (CSP, HSTS)
- ✅ **Rate Limiting** - Protección DDoS (100 req/15min)
- ✅ **Validación de Datos** - express-validator en todos los inputs
- ✅ **Sanitización** - Prevención XSS en inputs
- ✅ **bcrypt** - Hashing seguro de contraseñas (10 rounds)
- ✅ **JWT** - Tokens con expiración 8h
- ✅ **Prepared Statements** - Prevención SQL injection
- ✅ **CORS** - Orígenes permitidos configurados
- ✅ **HPP** - Protección parameter pollution

## 📊 Base de Datos

### Tablas Principales (9)
- `usuarios` - Visitantes registrados
- `quizzes` - Quizzes disponibles
- `preguntas` - Preguntas por quiz
- `respuestas` - Opciones de respuesta
- `sesiones_quiz` - Sesiones de juego
- `ranking` - Tabla de posiciones
- `codigos_qr` - Códigos QR generados
- `administradores` - Usuarios admin
- `logs_auditoria` - Registro de acciones

### Comandos Útiles SQL
```sql
-- Ver ranking
SELECT * FROM ranking ORDER BY puntaje DESC, tiempo_segundos ASC LIMIT 10;

-- Limpiar ranking para demo
DELETE FROM sesiones_quiz WHERE completado = 1;

-- Ver códigos QR activos
SELECT * FROM codigos_qr WHERE activo = 1;
```

## 🚀 Deployment en Producción

### Preparar Backend
```bash
cd backend
npm install --production
```

### Compilar Frontend
```bash
cd frontend
npm run build
# Archivos en /dist
```

### Variables de Entorno Producción
- Cambiar `JWT_SECRET` por cadena aleatoria segura (64+ caracteres)
- Configurar `FRONTEND_URL` con dominio real
- Usar usuario BD con permisos limitados
- Configurar `NODE_ENV=production`

### Recomendaciones
- Usar **PM2** para gestión de procesos Node.js
- Configurar **Nginx** como proxy inverso
- Implementar **SSL/TLS** con Let's Encrypt
- Configurar **backups automáticos** diarios de BD

## 📝 Scripts Disponibles

### Backend
```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
```

### Frontend
```bash
npm run dev      # Servidor desarrollo
npm run build    # Build producción
npm run preview  # Preview build
```

## 👥 Equipo de Desarrollo

- **Evelyn** - Programación y arquitectura del sistema
- **Felipe** - Documentación técnica e informe
- **Belén** - Manual de usuario

## 📄 Licencia

Proyecto académico - Instituto Profesional AIEP  
Analista Programador - 2025

## 📞 Soporte

Para problemas o consultas:
- Revisar sección [Troubleshooting](#troubleshooting)
- Consultar documentación técnica en `/docs`
- Contactar al equipo de desarrollo

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0.0  
**Estado:** Producción