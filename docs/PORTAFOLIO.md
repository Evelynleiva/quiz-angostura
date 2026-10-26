# Quiz Museo Angostura

Este proyecto lo desarrollamos como trabajo final de Analista Programador en INACAP. La idea era que las personas que visitan el Museo Angostura del Biobío pudieran responder preguntas relacionadas con el recorrido desde su celular.

Para acceder a los cuestionarios se utilizan códigos QR. Los visitantes pueden ingresar con un apodo, responder preguntas, ver sus resultados y consultar el ranking. El sistema también contempla un panel de administración para gestionar los cuestionarios.

## Tecnologías

- React y Vite para el frontend
- Node.js y Express para el backend
- MySQL para guardar la información
- JWT para la autenticación del administrador

## Organización

El repositorio está dividido en `frontend`, `backend` y `db`. El frontend se comunica con el backend mediante una API. En el backend se encuentran las rutas de usuarios, cuestionarios, sesiones, ranking y códigos QR.

## Instalación

Las instrucciones de instalación y las variables de entorno están en el [README principal](../README.md).

## Equipo

Fue un proyecto académico grupal. Los integrantes están indicados en el README principal.

## Notas

El README principal incluye cifras de pruebas y comandos `npm test` que aún no se han contrastado con una ejecución reciente. Los archivos `package.json` consultados no incluyen un script `test`, así que esos comandos no deben considerarse verificados.
