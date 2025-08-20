# Calculadora de Riesgos - Frontend

Sistema completo de evaluación y gestión de riesgos laborales desarrollado con Next.js.

## 🚀 Características

- **Matriz de Riesgo 5x5**: Cálculo automático de niveles de riesgo (Probabilidad × Severidad)
- **Semáforo de Colores**: Visualización intuitiva del nivel de riesgo
- **Recomendaciones Automáticas**: Sugerencias basadas en el nivel de riesgo calculado
- **Gestión de Catálogos**: Peligros, tareas, controles y responsables
- **Evaluaciones CRUD**: Crear, leer, actualizar y eliminar evaluaciones
- **Exportación**: PDF y CSV de evaluaciones
- **Autenticación**: Sistema de login/registro con JWT
- **Roles**: Administrador y usuario
- **Frontend Moderno**: Next.js con TypeScript y Tailwind CSS

## 🛠️ Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** + **Radix UI**
- **React Query** (TanStack Query)
- **React Hook Form** + **Zod**
- **Lucide React** (Iconos)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend NestJS ejecutándose en puerto 3001

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Iniciar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## 📊 Estructura del Proyecto

```
src/
├── app/                    # App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── risk-assessments/  # Evaluaciones de riesgo
│   └── catalog/           # Catálogos
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── dashboard.tsx     # Dashboard principal
│   ├── header.tsx        # Header con navegación
│   ├── risk-matrix.tsx   # Matriz de riesgo
│   └── risk-assessment-form.tsx # Formulario de evaluación
├── hooks/                # Hooks personalizados
│   └── use-api.ts        # Hooks para React Query
├── lib/                  # Utilidades
│   ├── api.ts            # Cliente API
│   ├── schemas.ts        # Esquemas Zod
│   ├── risk-calculator.ts # Cálculos de riesgo
│   └── utils.ts          # Utilidades generales
└── types/                # Tipos TypeScript
```

## 🎯 Funcionalidades Principales

### 1. Matriz de Riesgo
- Matriz 5x5 (Probabilidad × Severidad)
- Cálculo automático del nivel de riesgo
- Colores: Verde (1-5), Amarillo (6-10), Naranja (11-15), Rojo (16-25)

### 2. Evaluaciones de Riesgo
- Crear evaluaciones completas
- Seleccionar peligro, tarea y responsable
- Calcular riesgo inicial y residual
- Aplicar controles existentes
- Generar recomendaciones automáticas

### 3. Gestión de Catálogos
- **Peligros**: Categorías (Físico, Químico, Biológico, etc.)
- **Tareas**: Actividades y departamentos
- **Controles**: Medidas con efectividad
- **Responsables**: Personas y departamentos

### 4. Exportación
- PDF de evaluaciones individuales
- CSV de todas las evaluaciones
- Reportes detallados

### 5. Autenticación
- Registro de usuarios
- Login con JWT
- Roles: Admin y Usuario
- Protección de rutas

## 📱 Uso del Sistema

### 1. Registro e Inicio de Sesión
1. Acceder a http://localhost:3000
2. Registrarse o iniciar sesión
3. Completar el perfil

### 2. Configurar Catálogos
1. Ir a "Catálogos" en el menú
2. Crear peligros, tareas, controles y responsables
3. Organizar por categorías y departamentos

### 3. Crear Evaluación de Riesgo
1. Ir a "Nueva Evaluación"
2. Seleccionar peligro, tarea y responsable
3. Usar la matriz para seleccionar probabilidad y severidad
4. Seleccionar controles existentes
5. Revisar recomendaciones automáticas
6. Guardar la evaluación

### 4. Gestionar Evaluaciones
1. Ver lista de evaluaciones
2. Filtrar por nivel de riesgo
3. Exportar a PDF o CSV
4. Editar o eliminar evaluaciones

## 🧪 Testing

```bash
npm run test
```

## 🚀 Despliegue

### Producción
```bash
npm run build
npm start
```

## 📝 Scripts Disponibles

- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm start` - Ejecutar en producción
- `npm run lint` - Ejecutar ESLint

## 🔐 Autenticación

### Roles Disponibles
- **Admin**: Acceso completo al sistema
- **User**: Acceso limitado a evaluaciones

### Endpoints de Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/me` - Perfil del usuario

## 🔄 Actualizaciones

Para mantener el proyecto actualizado:

```bash
npm update
```

---

**¡Disfruta usando la Calculadora de Riesgos! 🎉**
