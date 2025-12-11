# Quiz Angostura

Proyecto de aplicación web de preguntas y respuestas (quiz) desarrollado como parte de la asignatura de Proyecto Integrado. 
Permite gestionar quizzes, generar códigos QR, registrar respuestas de los usuarios y mostrar un ranking de resultados.

## Tecnologías utilizadas

- Python / Django + MySQL para el backend.
- JavaScript / React / Vite para el frontend.
- HTML y CSS para la interfaz de usuario.
- Axios para la comunicación entre frontend y backend.
- Lectura y generación de códigos QR para acceder a los quizzes.
  
## Objetivo del proyecto

Implementar un sistema de quiz que permita:

- Administrar quizzes, preguntas, respuestas y códigos QR desde un panel de administración.
- Registrar la participación de los usuarios y sus puntajes.
- Visualizar puntajes y ranking de resultados por quiz y global.
- Permitir que los usuarios accedan a los quizzes escaneando un código QR desde sus teléfonos.

## Puesta en marcha (desarrollo)

### Backend

1. Clonar el repositorio.
2. Crear y activar un entorno virtual (`venv`) en la carpeta del proyecto.
3. Instalar dependencias:

pip install -r requirements.txt

4. Configurar el archivo `.env` con las credenciales de la base de datos MySQL.
5. Ejecutar migraciones (si aplica) y levantar el servidor backend en:

python manage.py runserver 0.0.0.0:5000

### Frontend

1. Entrar en la carpeta `frontend`:

cd frontend
2. Instalar dependencias:

npm install
3. Levantar el servidor de desarrollo:
npm run dev -- --host

4. La aplicación quedará disponible en `http://localhost:5173` y consumirá la API en `http://localhost:5000/api`.

## Pruebas con códigos QR

- El panel de administración permite generar códigos QR asociados a un quiz.
- Para pruebas en la misma máquina, los QR pueden usar `http://localhost:5173/...`.
- Para pruebas desde un celular en la misma red, se recomienda generar códigos QR con la IP local de la máquina que ejecuta el proyecto, por ejemplo:
`http://192.168.x.x:5173/quiz/<codigo>`.


