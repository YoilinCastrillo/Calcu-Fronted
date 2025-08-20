import axios from 'axios'
import { 
  Hazard, 
  Task, 
  Control, 
  Responsible, 
  RiskAssessment,
  RiskAssessmentWithDetails,
  LoginData,
  RegisterData
} from './schemas'

// Configuración base de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API de autenticación
export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
  
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  
  me: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// API de peligros
export const hazardsAPI = {
  getAll: async (): Promise<Hazard[]> => {
    const response = await api.get('/hazards')
    return response.data
  },
  
  getById: async (id: number): Promise<Hazard> => {
    const response = await api.get(`/hazards/${id}`)
    return response.data
  },
  
  create: async (data: Hazard): Promise<Hazard> => {
    const response = await api.post('/hazards', data)
    return response.data
  },
  
  update: async (id: number, data: Partial<Hazard>): Promise<Hazard> => {
    const response = await api.put(`/hazards/${id}`, data)
    return response.data
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/hazards/${id}`)
  },
}

// API de tareas
export const tasksAPI = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/tasks')
    return response.data
  },
  
  getById: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },
  
  create: async (data: Task): Promise<Task> => {
    const response = await api.post('/tasks', data)
    return response.data
  },
  
  update: async (id: number, data: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data)
    return response.data
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}

// API de controles
export const controlsAPI = {
  getAll: async (): Promise<Control[]> => {
    const response = await api.get('/controls')
    return response.data
  },
  
  getById: async (id: number): Promise<Control> => {
    const response = await api.get(`/controls/${id}`)
    return response.data
  },
  
  create: async (data: Control): Promise<Control> => {
    const response = await api.post('/controls', data)
    return response.data
  },
  
  update: async (id: number, data: Partial<Control>): Promise<Control> => {
    const response = await api.put(`/controls/${id}`, data)
    return response.data
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/controls/${id}`)
  },
}

// API de responsables
export const responsiblesAPI = {
  getAll: async (): Promise<Responsible[]> => {
    const response = await api.get('/responsibles')
    return response.data
  },
  
  getById: async (id: number): Promise<Responsible> => {
    const response = await api.get(`/responsibles/${id}`)
    return response.data
  },
  
  create: async (data: Responsible): Promise<Responsible> => {
    const response = await api.post('/responsibles', data)
    return response.data
  },
  
  update: async (id: number, data: Partial<Responsible>): Promise<Responsible> => {
    const response = await api.put(`/responsibles/${id}`, data)
    return response.data
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/responsibles/${id}`)
  },
}

// API de evaluaciones de riesgo
export const riskAssessmentsAPI = {
  getAll: async (): Promise<RiskAssessmentWithDetails[]> => {
    const response = await api.get('/risk-assessments')
    return response.data
  },
  
  getById: async (id: number): Promise<RiskAssessmentWithDetails> => {
    const response = await api.get(`/risk-assessments/${id}`)
    return response.data
  },
  
  create: async (data: RiskAssessment): Promise<RiskAssessmentWithDetails> => {
    const response = await api.post('/risk-assessments', data)
    return response.data
  },
  
  update: async (id: number, data: Partial<RiskAssessment>): Promise<RiskAssessmentWithDetails> => {
    const response = await api.put(`/risk-assessments/${id}`, data)
    return response.data
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/risk-assessments/${id}`)
  },
  
  exportPDF: async (id: number): Promise<Blob> => {
    const response = await api.get(`/risk-assessments/${id}/pdf`, {
      responseType: 'blob',
    })
    return response.data
  },
  
  exportCSV: async (): Promise<Blob> => {
    const response = await api.get('/risk-assessments/export/csv', {
      responseType: 'blob',
    })
    return response.data
  },
}

export default api
