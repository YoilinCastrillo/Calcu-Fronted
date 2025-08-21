'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RiskMatrix } from '@/components/risk-matrix'
import { riskAssessmentSchema, type RiskAssessment } from '@/lib/schemas'
import { calculateInitialRisk, calculateResidualRisk, generateRecommendations } from '@/lib/risk-calculator'
import { useHazards, useTasks, useControls, useResponsibles, useCreateRiskAssessment } from '@/hooks/use-api'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
import type { Hazard, Control } from '@/lib/schemas'

// === Type guards ===
function hasHazardId(h: Hazard): h is Hazard & { id: number } {
  return typeof (h as any).id === 'number'
}
function hasControlId(c: Control): c is Control & { id: number } {
  return typeof (c as any).id === 'number'
}

interface RiskAssessmentFormProps {
  onSuccess?: () => void
}

export function RiskAssessmentForm({ onSuccess }: RiskAssessmentFormProps) {
  const [selectedProbability, setSelectedProbability] = useState<number>()
  const [selectedSeverity, setSelectedSeverity] = useState<number>()
  const [initialRiskScore, setInitialRiskScore] = useState<number>()
  const [residualRiskScore, setResidualRiskScore] = useState<number>()
  const [recommendations, setRecommendations] = useState<string[]>([])

  const { data: hazards = [] } = useHazards()
  const { data: tasks = [] } = useTasks()
  const { data: controls = [] } = useControls()
  const { data: responsibles = [] } = useResponsibles()
  const createAssessment = useCreateRiskAssessment()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RiskAssessment>({
    resolver: zodResolver(riskAssessmentSchema),
    defaultValues: {
      controlIds: [],
      additionalControls: '',
      implementationDate: '',
    },
  })

  const watchedControlIds = watch('controlIds') ?? []

  // Matriz: calcular riesgo inicial
  const handleMatrixSelect = (probability: number, severity: number) => {
    setSelectedProbability(probability)
    setSelectedSeverity(severity)
    setValue('probability', probability)
    setValue('severity', severity)

    const { score } = calculateInitialRisk(probability, severity)
    setInitialRiskScore(score)
    setRecommendations(generateRecommendations(score))
  }

  // Calcular riesgo residual cuando cambian controles o el riesgo inicial
  useEffect(() => {
    if (initialRiskScore === undefined) {
      setResidualRiskScore(undefined)
      return
    }

    // controlIds desde RHF vienen como string[], conviértelos a number[]
    const selectedIds = (watchedControlIds as (string | number)[]).map((v) => Number(v))

    const selectedControls = controls
      .filter(hasControlId)
      .filter((c) => selectedIds.includes(c.id))

    if (selectedControls.length === 0) {
      setResidualRiskScore(undefined)
      return
    }

    const avgEffectiveness =
      selectedControls.reduce((sum, c) => sum + (c.effectiveness ?? 1), 0) /
      selectedControls.length

    setResidualRiskScore(calculateResidualRisk(initialRiskScore, avgEffectiveness))
  }, [initialRiskScore, watchedControlIds, controls])

  const onSubmit = async (data: RiskAssessment) => {
    try {
      // Normaliza controlIds a number[] porque react-hook-form los devuelve como string[]
      const payload: RiskAssessment = {
        ...data,
        controlIds: (data.controlIds ?? []).map(Number),
      }
  
      await createAssessment.mutateAsync(payload)  // 👈 ya sin initial/residual
      onSuccess?.()
    } catch (error) {
      console.error('Error al crear la evaluación:', error)
    }
  }

  const getRiskColorClass = (score: number) => {
    if (score <= 5) return 'text-green-600 bg-green-50 border-green-200'
    if (score <= 10) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (score <= 15) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario principal */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Evaluación</CardTitle>
              <CardDescription>
                Selecciona el peligro, tarea y responsable para la evaluación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Peligro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peligro *</label>
                <Select onValueChange={(value) => setValue('hazardId', Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un peligro" />
                  </SelectTrigger>
                  <SelectContent>
                    {hazards.filter(hasHazardId).map((hazard) => (
                      <SelectItem key={hazard.id} value={String(hazard.id)}>
                        {hazard.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.hazardId && (
                  <p className="text-red-600 text-sm mt-1">{errors.hazardId.message}</p>
                )}
              </div>

              {/* Tarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarea *</label>
                <Select onValueChange={(value) => setValue('taskId', Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una tarea" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks?.map((task: any) => (
                      <SelectItem key={task.id} value={String(task.id)}>
                        {task.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.taskId && (
                  <p className="text-red-600 text-sm mt-1">{errors.taskId.message}</p>
                )}
              </div>

              {/* Responsable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsable *</label>
                <Select onValueChange={(value) => setValue('responsibleId', Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibles?.map((r: any) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.name} - {r.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.responsibleId && (
                  <p className="text-red-600 text-sm mt-1">{errors.responsibleId.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controles */}
          <Card>
            <CardHeader>
              <CardTitle>Controles Existentes</CardTitle>
              <CardDescription>Selecciona los controles que ya están implementados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {controls.filter(hasControlId).map((control) => (
                  <label key={control.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      value={String(control.id)}
                      {...register('controlIds')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-sm">{control.name}</div>
                      <div className="text-xs text-gray-500">{control.description}</div>
                      <div className="text-xs text-gray-400">
                        Efectividad: {Math.round((control.effectiveness ?? 1) * 100)}%
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Controles adicionales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Controles Adicionales
                </label>
                <textarea
                  {...register('additionalControls')}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Describe controles adicionales que se implementarán..."
                />
              </div>

              {/* Fecha de implementación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Implementación
                </label>
                <Input type="date" {...register('implementationDate')} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Matriz y resultados */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluación de Riesgo</CardTitle>
              <CardDescription>Selecciona la probabilidad y severidad en la matriz</CardDescription>
            </CardHeader>
            <CardContent>
              <RiskMatrix
                selectedProbability={selectedProbability}
                selectedSeverity={selectedSeverity}
                onSelect={handleMatrixSelect}
              />
            </CardContent>
          </Card>

          {(initialRiskScore !== undefined || residualRiskScore !== undefined) && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados del Análisis</CardTitle>
                <CardDescription>Niveles de riesgo calculados automáticamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {initialRiskScore !== undefined && (
                  <div className={`p-4 rounded-lg border ${getRiskColorClass(initialRiskScore)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <h4 className="font-semibold">Riesgo Inicial</h4>
                    </div>
                    <div className="text-2xl font-bold">{initialRiskScore}</div>
                    <p className="text-sm opacity-80">
                      Nivel:{' '}
                      {initialRiskScore <= 5
                        ? 'Bajo'
                        : initialRiskScore <= 10
                        ? 'Medio'
                        : initialRiskScore <= 15
                        ? 'Alto'
                        : 'Crítico'}
                    </p>
                  </div>
                )}

                {residualRiskScore !== undefined && (
                  <div className={`p-4 rounded-lg border ${getRiskColorClass(residualRiskScore)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <h4 className="font-semibold">Riesgo Residual</h4>
                    </div>
                    <div className="text-2xl font-bold">{residualRiskScore}</div>
                    <p className="text-sm opacity-80">
                      Nivel:{' '}
                      {residualRiskScore <= 5
                        ? 'Bajo'
                        : residualRiskScore <= 10
                        ? 'Medio'
                        : residualRiskScore <= 15
                        ? 'Alto'
                        : 'Crítico'}
                    </p>
                  </div>
                )}

                {recommendations.length > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Recomendaciones</h4>
                    </div>
                    <ul className="space-y-1">
                      {recommendations.map((r, i) => (
                        <li key={i} className="text-sm text-blue-800 flex items-start space-x-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !initialRiskScore} className="min-w-[120px]">
          {isSubmitting ? 'Guardando...' : 'Guardar Evaluación'}
        </Button>
      </div>
    </form>
  )
}
