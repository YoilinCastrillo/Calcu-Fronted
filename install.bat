@echo off
echo 🚀 Instalando Calculadora de Riesgos...
echo ======================================

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado.
    pause
    exit /b 1
)

echo ✅ npm encontrado
npm --version

echo.
echo 📦 Instalando dependencias del Backend...
echo ========================================

cd ..\backend

REM Instalar dependencias
call npm install

REM Copiar archivo de configuración
if not exist .env (
    copy env.example .env
    echo ✅ Archivo .env creado
) else (
    echo ⚠️  Archivo .env ya existe
)

REM Generar cliente Prisma
echo 🗄️  Configurando base de datos...
call npm run prisma:generate

REM Ejecutar migraciones
call npm run prisma:migrate

echo ✅ Backend configurado correctamente
echo.

echo 📦 Instalando dependencias del Frontend...
echo =========================================

cd ..\frontend

REM Instalar dependencias
call npm install

REM Crear archivo de configuración
if not exist .env.local (
    echo NEXT_PUBLIC_API_URL=http://localhost:3001 > .env.local
    echo ✅ Archivo .env.local creado
) else (
    echo ⚠️  Archivo .env.local ya existe
)

echo ✅ Frontend configurado correctamente
echo.

cd ..

echo 🎉 ¡Instalación completada!
echo.
echo 📋 Para ejecutar el proyecto:
echo.
echo 1. Iniciar el Backend:
echo    cd backend
echo    npm run start:dev
echo.
echo 2. En otra terminal, iniciar el Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    API Docs: http://localhost:3001/api
echo.
echo 🔐 Para comenzar:
echo    1. Abre http://localhost:3000
echo    2. Regístrate como nuevo usuario
echo    3. ¡Comienza a usar la Calculadora de Riesgos!
echo.
echo 📚 Documentación:
echo    - Frontend: frontend\README.md
echo    - Backend:  backend\README.md
echo.
pause
