#!/bin/bash

echo "🚀 Instalando Calculadora de Riesgos..."
echo "======================================"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

echo ""
echo "📦 Instalando dependencias del Backend..."
echo "========================================"

cd ../backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Archivo .env creado"
else
    echo "⚠️  Archivo .env ya existe"
fi

# Generar cliente Prisma
echo "🗄️  Configurando base de datos..."
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

echo "✅ Backend configurado correctamente"
echo ""

echo "📦 Instalando dependencias del Frontend..."
echo "========================================="

cd ../frontend

# Instalar dependencias
npm install

# Crear archivo de configuración
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
    echo "✅ Archivo .env.local creado"
else
    echo "⚠️  Archivo .env.local ya existe"
fi

echo "✅ Frontend configurado correctamente"
echo ""

cd ..

echo "🎉 ¡Instalación completada!"
echo ""
echo "📋 Para ejecutar el proyecto:"
echo ""
echo "1. Iniciar el Backend:"
echo "   cd backend"
echo "   npm run start:dev"
echo ""
echo "2. En otra terminal, iniciar el Frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   API Docs: http://localhost:3001/api"
echo ""
echo "🔐 Para comenzar:"
echo "   1. Abre http://localhost:3000"
echo "   2. Regístrate como nuevo usuario"
echo "   3. ¡Comienza a usar la Calculadora de Riesgos!"
echo ""
echo "📚 Documentación:"
echo "   - Frontend: frontend/README.md"
echo "   - Backend:  backend/README.md"
echo ""
