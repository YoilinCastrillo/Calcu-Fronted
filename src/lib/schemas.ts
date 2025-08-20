import { z } from 'zod'

// Esquemas para catálogos
export const hazardSchema = z.object({
  id: z.number().optional(), 
  name: z.string().min(1, 'El nombre del peligro es requerido'),
  description: z.string().optional(),
  category: z.string().min(1, 'La categoría es requerida'),
})

export const taskSchema = z.object({
  name: z.string().min(1, 'El nombre de la tarea es requerido'),
  description: z.string().optional(),
  department: z.string().min(1, 'El departamento es requerido'),
})

export const controlSchema = z.object({
  name: z.string().min(1, 'El nombre del control es requerido'),
  description: z.string().optional(),
  type: z.string().min(1, 'El tipo de control es requerido'),
  effectiveness: z.number().min(0).max(1).default(1.0),
})

export const responsibleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  department: z.string().min(1, 'El departamento es requerido'),
})

// Esquema para evaluación de riesgo
export const riskAssessmentSchema = z.object({
  hazardId: z.number().min(1, 'Debe seleccionar un peligro'),
  taskId: z.number().min(1, 'Debe seleccionar una tarea'),
  probability: z.number().min(1).max(5, 'La probabilidad debe estar entre 1 y 5'),
  severity: z.number().min(1).max(5, 'La severidad debe estar entre 1 y 5'),
  responsibleId: z.number().min(1, 'Debe seleccionar un responsable'),
  controlIds: z.array(z.number()).optional(),
  additionalControls: z.string().optional(),
  implementationDate: z.string().optional(),
})

// Esquemas para autenticación
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'user']).default('user'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

// Tipos derivados de los esquemas
export type Hazard = z.infer<typeof hazardSchema>
export type Task = z.infer<typeof taskSchema>
export type Control = z.infer<typeof controlSchema>
export type Responsible = z.infer<typeof responsibleSchema>
export type RiskAssessment = z.infer<typeof riskAssessmentSchema>
export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>


// Tipos adicionales para la aplicación
export interface RiskMatrix {
  probability: number
  severity: number
  score: number
  color: 'green' | 'yellow' | 'orange' | 'red'
  level: 'Bajo' | 'Medio' | 'Alto' | 'Crítico'
}

export interface RiskAssessmentWithDetails extends RiskAssessment {
  id: number
  initialRisk: number
  residualRisk?: number
  createdAt: string
  updatedAt: string
  hazard: Hazard & { id: number }
  task: Task & { id: number }
  responsible: Responsible & { id: number }
  controls?: (Control & { id: number })[]
  user: {
    id: number
    name: string
    email: string
  }
}
