@echo off
title CONFIGURACION HOTSPOT
color 0E

echo.
echo ========================================
echo   CONFIGURACION PARA HOTSPOT
echo ========================================
echo.

echo PASOS:
echo.
echo [1] Activa HOTSPOT en tu celular
echo [2] Conecta tu LAPTOP al WiFi del hotspot
echo [3] Presiona ENTER cuando estes conectado
echo.
pause

echo.
echo Obteniendo IP de la laptop...
echo.

ipconfig | findstr /i "IPv4"

echo.
echo ========================================
echo.
echo Busca la IP del "Adaptador WiFi"
echo Normalmente: 192.168.43.X
echo.

set /p IP_LAPTOP="Ingresa la IP de tu LAPTOP: "

echo.
echo Configurando con IP: %IP_LAPTOP%
echo.

:: Actualizar frontend .env
echo VITE_API_URL=http://%IP_LAPTOP%:5000/api > frontend\.env

echo.
echo ? Frontend configurado
echo.

:: Guardar configuracion
echo IP_LAPTOP=%IP_LAPTOP% > HOTSPOT_CONFIG.txt
echo URL_CELULAR=http://%IP_LAPTOP%:5173 >> HOTSPOT_CONFIG.txt

echo ========================================
echo   CONFIGURACION COMPLETA
echo ========================================
echo.
echo URL para abrir en tu celular:
echo http://%IP_LAPTOP%:5173
echo.
echo ========================================
echo.
echo Ahora ejecuta: INICIAR_SISTEMA.bat
echo.
pause
