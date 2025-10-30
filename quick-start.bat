@echo off
echo.
echo =======================================
echo   INICIO RAPIDO - MONITOREO DE REPOS
echo =======================================
echo.
echo Selecciona una opcion:
echo.
echo   [1] Instalar dependencias (primera vez)
echo   [2] Ejecutar monitoreo UNA VEZ (test)
echo   [3] Iniciar servicio AUTOMATICO
echo   [4] Ver ayuda
echo   [5] Salir
echo.
set /p opcion="Opcion: "

if "%opcion%"=="1" goto instalar
if "%opcion%"=="2" goto test
if "%opcion%"=="3" goto start
if "%opcion%"=="4" goto ayuda
if "%opcion%"=="5" goto salir

echo Opcion invalida
pause
goto :eof

:instalar
echo.
echo Instalando dependencias...
call setup.bat
goto :eof

:test
echo.
echo Ejecutando monitoreo (una sola vez)...
echo.
call npm test
echo.
pause
goto :eof

:start
echo.
echo Iniciando servicio automatico...
echo Presiona Ctrl+C para detener
echo.
call npm start
goto :eof

:ayuda
echo.
echo =======================================
echo   AYUDA
echo =======================================
echo.
echo COMANDOS DISPONIBLES:
echo   npm test      - Ejecutar una vez
echo   npm start     - Modo automatico
echo.
echo ARCHIVOS IMPORTANTES:
echo   config.js     - Configuracion de repositorios
echo   reports/      - Informes generados
echo.
echo PASOS INICIALES:
echo   1. Ejecuta setup.bat (opcion 1)
echo   2. Edita config.js con tus repos
echo   3. Ejecuta npm test para probar
echo   4. Usa npm start para automatico
echo.
pause
goto :eof

:salir
exit
