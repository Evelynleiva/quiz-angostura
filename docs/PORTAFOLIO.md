# Presentación del proyecto para portafolio

## Quiz interactivo — Museo Angostura del Biobío

Proyecto académico de Analista Programador orientado a ofrecer una experiencia educativa mediante cuestionarios accesibles desde códigos QR. El sistema está planteado para visitantes que responden preguntas desde sus dispositivos y para administradores que gestionan el contenido.

## Problema y propuesta

El proyecto busca hacer más interactiva la visita al museo. La propuesta consiste en asociar cuestionarios a códigos QR, registrar respuestas, calcular resultados y mostrar clasificaciones.

## Tecnologías documentadas

- **Frontend:** React, Vite, React Router, Axios y Tailwind CSS.
- **Backend:** Node.js, Express y API HTTP.
- **Base de datos:** MySQL.
- **Autenticación y seguridad:** JWT, bcrypt y middleware de protección descritos en el README principal.

> Esta ficha resume la documentación del repositorio. No equivale a una auditoría del código ni certifica que todas las funciones estén operativas en un despliegue actual.

## Funcionalidades descritas en el proyecto

- Acceso a cuestionarios mediante códigos QR.
- Registro de visitantes mediante apodos.
- Preguntas y respuestas con cálculo de resultados.
- Ranking y resultados para compartir.
- Panel administrativo para gestionar cuestionarios.

## Arquitectura general

El frontend presenta las interfaces de visitantes y administración. El backend expone rutas para autenticación, usuarios, cuestionarios, sesiones, ranking y códigos QR. MySQL almacena la información de la aplicación.

## Contexto de desarrollo

Trabajo académico realizado en equipo. Antes de atribuir responsabilidades individuales en un CV o entrevista, se debe especificar qué componentes implementó cada integrante.

## Cómo explorar el proyecto

Consulta el [README principal](../README.md) para requisitos, instalación, variables de entorno, rutas y estructura del proyecto.

**Precauciones:** utiliza credenciales de prueba propias; no reutilices contraseñas de ejemplo ni publiques archivos `.env` con secretos.

## Pendientes de verificación antes de usarlo como demostración laboral

- Ejecutar instalación, base de datos, frontend y backend en un entorno limpio.
- Comprobar las funciones principales y registrar evidencias visuales.
- Confirmar los comandos de pruebas disponibles: el README menciona `npm test`, pero su ejecución debe validarse contra los scripts de cada `package.json`.
- Revisar las cifras y afirmaciones de cobertura, rendimiento y seguridad del README con evidencia verificable.
- Precisar el aporte individual de cada participante.

## Enfoque profesional

Este proyecto permite conversar sobre integración frontend/backend, diseño de API, persistencia de datos, flujos de usuario y documentación técnica. Para entrevistas de QA también puede servir como base para elaborar casos de prueba y reportes de defectos, una vez ejecutada la aplicación.
