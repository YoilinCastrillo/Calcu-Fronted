import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  authAPI,
  hazardsAPI,
  tasksAPI,
  controlsAPI,
  responsiblesAPI,
  riskAssessmentsAPI,
} from '@/lib/api'
import type {
  Hazard,
  Task,
  Control,
  Responsible,
  RiskAssessment,
  LoginData,
  RegisterData,
} from '@/lib/schemas'

// Hooks de autenticación
export const useLogin = () => {
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      toast.success('Inicio de sesión exitoso')
    },
    onError: () => {
      toast.error('Error en el inicio de sesión')
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success('Registro exitoso')
    },
    onError: () => {
      toast.error('Error en el registro')
    },
  })
}

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: authAPI.me,
    retry: false,
  })
}

// Hooks de peligros
export const useHazards = () => {
  return useQuery({
    queryKey: ['hazards'],
    queryFn: hazardsAPI.getAll,
  })
}

export const useHazard = (id: number) => {
  return useQuery({
    queryKey: ['hazards', id],
    queryFn: () => hazardsAPI.getById(id),
    enabled: !!id,
  })
}

export const useCreateHazard = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: hazardsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hazards'] })
      toast.success('Peligro creado exitosamente')
    },
    onError: () => {
      toast.error('Error al crear el peligro')
    },
  })
}

export const useUpdateHazard = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Hazard> }) =>
      hazardsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hazards'] })
      toast.success('Peligro actualizado exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar el peligro')
    },
  })
}

export const useDeleteHazard = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: hazardsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hazards'] })
      toast.success('Peligro eliminado exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar el peligro')
    },
  })
}

// Hooks de tareas
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksAPI.getAll,
  })
}

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksAPI.getById(id),
    enabled: !!id,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: tasksAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Tarea creada exitosamente')
    },
    onError: () => {
      toast.error('Error al crear la tarea')
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
      tasksAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Tarea actualizada exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar la tarea')
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: tasksAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Tarea eliminada exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar la tarea')
    },
  })
}

// Hooks de controles
export const useControls = () => {
  return useQuery({
    queryKey: ['controls'],
    queryFn: controlsAPI.getAll,
  })
}

export const useControl = (id: number) => {
  return useQuery({
    queryKey: ['controls', id],
    queryFn: () => controlsAPI.getById(id),
    enabled: !!id,
  })
}

export const useCreateControl = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: controlsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controls'] })
      toast.success('Control creado exitosamente')
    },
    onError: () => {
      toast.error('Error al crear el control')
    },
  })
}

export const useUpdateControl = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Control> }) =>
      controlsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controls'] })
      toast.success('Control actualizado exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar el control')
    },
  })
}

export const useDeleteControl = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: controlsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controls'] })
      toast.success('Control eliminado exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar el control')
    },
  })
}

// Hooks de responsables
export const useResponsibles = () => {
  return useQuery({
    queryKey: ['responsibles'],
    queryFn: responsiblesAPI.getAll,
  })
}

export const useResponsible = (id: number) => {
  return useQuery({
    queryKey: ['responsibles', id],
    queryFn: () => responsiblesAPI.getById(id),
    enabled: !!id,
  })
}

export const useCreateResponsible = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: responsiblesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsibles'] })
      toast.success('Responsable creado exitosamente')
    },
    onError: () => {
      toast.error('Error al crear el responsable')
    },
  })
}

export const useUpdateResponsible = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Responsible> }) =>
      responsiblesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsibles'] })
      toast.success('Responsable actualizado exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar el responsable')
    },
  })
}

export const useDeleteResponsible = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: responsiblesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsibles'] })
      toast.success('Responsable eliminado exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar el responsable')
    },
  })
}

// Hooks de evaluaciones de riesgo
export const useRiskAssessments = () => {
  return useQuery({
    queryKey: ['risk-assessments'],
    queryFn: riskAssessmentsAPI.getAll,
  })
}

export const useRiskAssessment = (id: number) => {
  return useQuery({
    queryKey: ['risk-assessments', id],
    queryFn: () => riskAssessmentsAPI.getById(id),
    enabled: !!id,
  })
}

export const useCreateRiskAssessment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: riskAssessmentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-assessments'] })
      toast.success('Evaluación de riesgo creada exitosamente')
    },
    onError: () => {
      toast.error('Error al crear la evaluación de riesgo')
    },
  })
}

export const useUpdateRiskAssessment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RiskAssessment> }) =>
      riskAssessmentsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-assessments'] })
      toast.success('Evaluación de riesgo actualizada exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar la evaluación de riesgo')
    },
  })
}

export const useDeleteRiskAssessment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: riskAssessmentsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-assessments'] })
      toast.success('Evaluación de riesgo eliminada exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar la evaluación de riesgo')
    },
  })
}

export const useExportRiskAssessmentPDF = () => {
  return useMutation({
    mutationFn: riskAssessmentsAPI.exportPDF,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'evaluacion-riesgo.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('PDF exportado exitosamente')
    },
    onError: () => {
      toast.error('Error al exportar PDF')
    },
  })
}

export const useExportRiskAssessmentsCSV = () => {
  return useMutation({
    mutationFn: riskAssessmentsAPI.exportCSV,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'evaluaciones-riesgo.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('CSV exportado exitosamente')
    },
    onError: () => {
      toast.error('Error al exportar CSV')
    },
  })
}
