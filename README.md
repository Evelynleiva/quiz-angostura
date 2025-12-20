# 🏛️ Sistema de Quiz Interactivo - Museo Angostura del Biobío

Sistema web completo para quizzes educativos interactivos del Museo Angostura del Biobío, desarrollado como proyecto final de Analista Programador en Inacap

![Estado](https://img.shields.io/badge/Estado-Completo-brightgreen)
![Version](https://img.shields.io/badge/Versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-yellow)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Seguridad](#seguridad)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

---

## ✨ Características

### 🎮 Funcionalidades Principales

- ✅ **Sistema de Quiz Completo**: Quizzes con múltiples preguntas y respuestas
- ✅ **Códigos QR Dinámicos**: Generación automática de códigos QR para cada quiz
- ✅ **Registro de Usuarios**: Sistema de nicknames sin autenticación compleja
- ✅ **Ranking en Tiempo Real**: Tabla de clasificación actualizada automáticamente
- ✅ **Resultados Compartibles**: Generación de imágenes con resultados para compartir
- ✅ **Panel de Administración**: Gestión completa de quizzes, usuarios y estadísticas
- ✅ **Responsive Design**: Funciona en desktop, tablet y móvil

### 🛡️ Seguridad Implementada

- ✅ **Helmet**: Headers HTTP seguros
- ✅ **Rate Limiting**: Protección contra fuerza bruta (100 req/15min general, 5 req/15min login)
- ✅ **CORS**: Configuración de orígenes permitidos
- ✅ **HPP**: Protección contra HTTP Parameter Pollution
- ✅ **JWT**: Autenticación con tokens (expiración 8h)
- ✅ **bcrypt**: Hashing seguro de contraseñas
- ✅ **Prepared Statements**: Prevención de SQL Injection

### 🎨 Interfaz de Usuario

- Diseño moderno con Tailwind CSS
- Mascota "Quibar" 🦊 como guía interactivo
- Animaciones y transiciones suaves
- Feedback visual inmediato
- Modo oscuro en resultados

---

## 🛠️ Tecnologías

### Backend
- **Node.js** v18+ con Express
- **MySQL** 8.0+
- **ES Modules** (import/export)
- **JWT** para autenticación
- **QRCode** para generación de códigos QR
- **bcrypt** para hashing de contraseñas

### Frontend
- **React** 19.2.0 con Vite
- **React Router DOM** para navegación
- **Axios** para peticiones HTTP
- **Tailwind CSS** para estilos
- **html2canvas** para captura de imágenes
- **html5-qrcode** para escaneo de QR

### Base de Datos
- **MySQL** 8.0+
- 9 tablas normalizadas (3FN)
- Índices optimizados
- Foreign Keys con CASCADE
- Tabla de auditoría con JSON

---

## 📦 Requisitos Previos

- Node.js v18.0.0 o superior
- MySQL 8.0 o superior
- npm o yarn
- Git

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Evelynleiva/quiz-angostura.git
cd quiz-angostura
```

### 2. Instalar dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configurar Base de Datos

**Crear la base de datos:**
```bash
mysql -u root -p < db/museo_quiz.sql
```

O manualmente:
```sql
CREATE DATABASE museo_quiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE museo_quiz;
SOURCE db/museo_quiz.sql;
```

---

## ⚙️ Configuración

### Backend (.env)

Crea el archivo `backend/.env`:
```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=museo_quiz
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura
JWT_EXPIRES_IN=8h

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

Crea el archivo `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎯 Uso

### Inicio Rápido (Desarrollo)

**Opción 1: Todo junto desde la raíz**
```bash
npm run dev
```

**Opción 2: Por separado**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Acceso

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Admin:** http://localhost:5173/admin/login
  - Email: `admin@museo.cl`
  - Password: `Admin123!`

---

## 📁 Estructura del Proyecto
```
QuizAngostura/
├── backend/
│   ├── config/
│   │   └── database.js          # Conexión MySQL
│   ├── middleware/
│   │   ├── auth.js              # Middleware JWT
│   │   ├── validation.js        # Validaciones
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── security.js          # Seguridad general
│   ├── routes/
│   │   ├── auth.routes.js       # Autenticación
│   │   ├── usuarios.routes.js   # Gestión usuarios
│   │   ├── quizzes.routes.js    # Gestión quizzes
│   │   ├── sesiones.routes.js   # Sesiones de juego
│   │   ├── ranking.routes.js    # Rankings
│   │   └── qr.routes.js         # Códigos QR
│   ├── .env
│   ├── server.js                # Servidor principal
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── QUIBAR.png           # Mascota
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Componentes reutilizables
│   │   │   └── layout/          # Layout components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── QuizLista.jsx
│   │   │   ├── QuizRegistro.jsx
│   │   │   ├── QuizJugar.jsx
│   │   │   ├── QuizResultado.jsx
│   │   │   ├── Ranking.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminQuizForm.jsx
│   │   │   └── AdminQR.jsx
│   │   ├── services/
│   │   │   └── api.js           # Configuración Axios
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── db/
│   └── museo_quiz.sql           # Schema de BD
│
├── CONFIGURAR_HOTSPOT.bat       # Script configuración IP
├── INICIAR_SISTEMA.bat          # Script inicio rápido
└── README.md
```

---

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/login           # Login administrador
GET    /api/auth/verificar       # Verificar token
```

### Usuarios
```
POST   /api/usuarios/registro    # Registrar visitante
GET    /api/usuarios/buscar/:nickname
GET    /api/usuarios             # Listar todos
```

### Quizzes
```
GET    /api/quizzes              # Listar activos
GET    /api/quizzes/:id          # Obtener uno con preguntas
POST   /api/quizzes              # Crear (admin)
PUT    /api/quizzes/:id          # Actualizar (admin)
DELETE /api/quizzes/:id          # Eliminar (admin)
POST   /api/quizzes/:id/verificar # Verificar respuestas
```

### Sesiones
```
POST   /api/sesiones/iniciar     # Iniciar sesión
POST   /api/sesiones/finalizar/:id # Finalizar sesión
GET    /api/sesiones/usuario/:id # Por usuario
GET    /api/sesiones             # Todas (admin)
```

### Ranking
```
GET    /api/ranking              # Top 10 global
GET    /api/ranking/quiz/:id     # Por quiz
GET    /api/ranking/usuario/:id  # Posición usuario
```

### Códigos QR
```
GET    /api/qr                   # Listar todos
POST   /api/qr/generar           # Generar nuevo
POST   /api/qr/escanear/:codigo  # Registrar escaneo
PATCH  /api/qr/:id/activar       # Activar
PATCH  /api/qr/:id/desactivar    # Desactivar
DELETE /api/qr/:id               # Eliminar
```

---

## 🛡️ Seguridad

### Medidas Implementadas

1. **Helmet** - Headers HTTP seguros
2. **Rate Limiting** - Prevención de ataques de fuerza bruta
3. **CORS** - Configuración de orígenes permitidos
4. **HPP** - Protección contra HTTP Parameter Pollution
5. **JWT** - Tokens con expiración
6. **bcrypt** - Hashing de contraseñas (salt rounds: 10)
7. **Prepared Statements** - Prevención de SQL Injection
8. **Validación de entrada** - express-validator

### Configuración de Seguridad
```javascript
// Rate Limiting
General: 100 requests / 15 minutos
Login: 5 intentos / 15 minutos

// JWT
Expiración: 8 horas
Algoritmo: HS256

// bcrypt
Salt rounds: 10
```

---

## 🚀 Despliegue

### Configuración para Red Local (Museo)

**Para usar en red local con hotspot:**

1. **Activar hotspot** en tu dispositivo
2. **Conectar laptop** al hotspot
3. **Ejecutar configuración:**
```bash
   CONFIGURAR_HOTSPOT.bat
```
4. **Ingresar IP** que muestre el script
5. **Iniciar sistema:**
```bash
   INICIAR_SISTEMA.bat
```

### Despliegue en Producción

**Backend (Railway/Render/Heroku):**
1. Crear proyecto en plataforma
2. Configurar variables de entorno
3. Conectar base de datos MySQL
4. Deploy desde GitHub

**Frontend (Vercel/Netlify):**
1. Conectar repositorio
2. Configurar variable `VITE_API_URL`
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 📊 Base de Datos

### Tablas
```sql
administradores       # Cuentas admin
usuarios              # Visitantes del museo
quizzes               # Quizzes disponibles
preguntas             # Preguntas de cada quiz
respuestas            # Opciones de respuesta
sesiones_quiz         # Sesiones de juego
respuestas_usuario    # Respuestas dadas
codigos_qr            # Códigos QR generados
logs_auditoria        # Registro de acciones
```

### Normalización

- ✅ Primera Forma Normal (1FN)
- ✅ Segunda Forma Normal (2FN)
- ✅ Tercera Forma Normal (3FN)

---

## 🧪 Testing

### Plan de Pruebas

- ✅ 30 casos de prueba documentados
- ✅ 29 exitosos (96.7%)
- ✅ Cobertura: funcionalidad, seguridad, UI/UX

### Ejecutar Pruebas
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📈 Métricas del Sistema

- **Código Backend:** ~800 líneas
- **Código Frontend:** ~2,500 líneas
- **Total:** ~3,300 líneas
- **API Endpoints:** 25
- **Tablas BD:** 9
- **Índices optimizados:** 15+

---

**Equipo:**
- Evelyn Leiva 
- Felipe 
- Belen

---

## 📞 Contacto

- **GitHub:** [@Evelynleiva](https://github.com/Evelynleiva)
- **Proyecto:** [quiz-angostura](https://github.com/Evelynleiva/quiz-angostura)

---

## 📝 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para más detalles.

---


🦊 *"Aprende jugando con Quibar"*
