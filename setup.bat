@echo off
echo.
echo ========================================
echo   INSTALACION DEL SISTEMA DE MONITOREO
echo ========================================
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js encontrado
echo.

REM Verificar Git
echo [2/4] Verificando Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git no esta instalado
    echo Por favor instala Git desde https://git-scm.com/
    pause
    exit /b 1
)
echo OK - Git encontrado
echo.

REM Instalar dependencias
echo [3/4] Instalando dependencias de Node.js...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion de dependencias
    pause
    exit /b 1
)
echo OK - Dependencias instaladas
echo.

REM Crear directorios necesarios
echo [4/4] Creando directorios...
if not exist "reports" mkdir reports
if not exist "logs" mkdir logs
echo OK - Directorios creados
echo.

echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo Proximos pasos:
echo   1. Edita config.js con las rutas de tus repositorios
echo   2. Ejecuta: npm test (para probar)
echo   3. Ejecuta: npm start (para modo automatico)
echo.
pause
