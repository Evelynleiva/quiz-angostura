@echo off
title SISTEMA QUIZ MUSEO
color 0A

echo.
echo ========================================
echo   QUIZ MUSEO ANGOSTURA - SISTEMA
echo ========================================
echo.

:: Verificar MySQL
echo [1/4] Verificando MySQL...
net start MySQL80 2>nul
if %errorlevel% == 0 (
    echo      ? MySQL iniciado
) else (
    echo      ? MySQL corriendo
)
timeout /t 2 /nobreak >nul

:: Verificar configuracion
echo.
echo [2/4] Verificando configuracion...
if exist HOTSPOT_CONFIG.txt (
    echo      ? Configuracion encontrada
    type HOTSPOT_CONFIG.txt
    echo.
) else (
    echo.
    echo      ? ATENCION: No se encontro configuracion
    echo.
    echo      Ejecuta CONFIGURAR_HOTSPOT.bat primero
    echo      o presiona ENTER para continuar sin ella
    echo.
    pause
)

:: Iniciar Backend
echo [3/4] Iniciando Backend (Puerto 5000)...
cd /d C:\PROYECTOS\QuizAngostura\backend
start "BACKEND Quiz Museo" cmd /k "color 0B && title BACKEND - Puerto 5000 && npm run dev"
timeout /t 5 /nobreak >nul

:: Iniciar Frontend  
echo [4/4] Iniciando Frontend (Puerto 5173)...
cd /d C:\PROYECTOS\QuizAngostura\frontend
start "FRONTEND Quiz Museo" cmd /k "color 0E && title FRONTEND - Puerto 5173 && npm run dev"
timeout /t 4 /nobreak >nul

echo.
echo ========================================
echo   ? SISTEMA INICIADO
echo ========================================
echo.

if exist HOTSPOT_CONFIG.txt (
    echo En tu CELULAR abre:
    type HOTSPOT_CONFIG.txt | findstr URL_CELULAR
) else (
    echo En tu navegador abre:
    echo http://localhost:5173
)

echo.
echo ========================================
echo.
echo Presiona cualquier tecla para salir
echo (Las ventanas de backend y frontend seguiran abiertas)
echo.
pause
