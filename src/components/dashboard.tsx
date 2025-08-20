'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRiskAssessments, useHazards, useTasks, useControls } from '@/hooks/use-api'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Plus,
  FileText,
  Download
} from 'lucide-react'
import { getRiskColor, getRiskLevel } from '@/lib/risk-calculator'
import { useExportRiskAssessmentsCSV } from '@/hooks/use-api'

export function Dashboard() {
  const { data: riskAssessments = [], isLoading: isLoadingAssessments } = useRiskAssessments()
  const { data: hazards = [], isLoading: isLoadingHazards } = useHazards()
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks()
  const { data: controls = [], isLoading: isLoadingControls } = useControls()
  const exportCSV = useExportRiskAssessmentsCSV()

  const isLoading = isLoadingAssessments || isLoadingHazards || isLoadingTasks || isLoadingControls

  // Calcular estadísticas
  const totalAssessments = riskAssessments.length
  const criticalRisks = riskAssessments.filter(ra => ra.initialRisk > 15).length
  const highRisks = riskAssessments.filter(ra => ra.initialRisk > 10 && ra.initialRisk <= 15).length
  const mediumRisks = riskAssessments.filter(ra => ra.initialRisk > 5 && ra.initialRisk <= 10).length
  const lowRisks = riskAssessments.filter(ra => ra.initialRisk <= 5).length

  // Evaluaciones recientes
  const recentAssessments = riskAssessments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const getRiskColorClass = (score: number) => {
    const color = getRiskColor(score)
    switch (color) {
      case 'green': return 'text-green-600 bg-green-50'
      case 'yellow': return 'text-yellow-600 bg-yellow-50'
      case 'orange': return 'text-orange-600 bg-orange-50'
      case 'red': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="animate-pulse bg-gray-200 h-4 w-24 rounded" />
                <div className="animate-pulse bg-gray-200 h-6 w-16 rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Resumen de evaluaciones de riesgo y estadísticas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => exportCSV.mutate()} disabled={exportCSV.isPending}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button asChild>
            <a href="/risk-assessments/new">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </a>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssessments}</div>
            <p className="text-xs text-muted-foreground">
              Evaluaciones realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riesgos Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalRisks}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riesgos Altos</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highRisks}</div>
            <p className="text-xs text-muted-foreground">
              Necesitan controles adicionales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riesgos Bajos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lowRisks}</div>
            <p className="text-xs text-muted-foreground">
              Bajo control
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Catálogos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Peligros</span>
            </CardTitle>
            <CardDescription>
              Catálogo de peligros identificados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hazards.length}</div>
            <p className="text-sm text-muted-foreground">
              peligros registrados
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <a href="/catalog/hazards">Gestionar</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Tareas</span>
            </CardTitle>
            <CardDescription>
              Actividades y tareas evaluadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-sm text-muted-foreground">
              tareas registradas
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <a href="/catalog/tasks">Gestionar</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Controles</span>
            </CardTitle>
            <CardDescription>
              Medidas de control implementadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controls.length}</div>
            <p className="text-sm text-muted-foreground">
              controles disponibles
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <a href="/catalog/controls">Gestionar</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Evaluaciones Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluaciones Recientes</CardTitle>
          <CardDescription>
            Las últimas evaluaciones de riesgo realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentAssessments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay evaluaciones recientes
            </div>
          ) : (
            <div className="space-y-4">
              {recentAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColorClass(assessment.initialRisk)}`}>
                        {getRiskLevel(assessment.initialRisk)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {assessment.hazard.name} - {assessment.task.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Responsable: {assessment.responsible.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {assessment.initialRisk}
                    </div>
                    <div className="text-xs text-gray-500">
                      Riesgo inicial
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {recentAssessments.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <a href="/risk-assessments">Ver todas las evaluaciones</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
