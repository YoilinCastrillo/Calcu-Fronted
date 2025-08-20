'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Header } from '@/components/header'
import { useRiskAssessments, useDeleteRiskAssessment, useExportRiskAssessmentPDF } from '@/hooks/use-api'
import { getRiskColor, getRiskLevel } from '@/lib/risk-calculator'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Calendar,
  User,
  AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function RiskAssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const { data: riskAssessments = [], isLoading } = useRiskAssessments()
  const deleteAssessment = useDeleteRiskAssessment()
  const exportPDF = useExportRiskAssessmentPDF()

  // Filtrar evaluaciones
  const filteredAssessments = riskAssessments.filter(assessment => {
    const matchesSearch = 
      assessment.hazard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.responsible.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRiskFilter = riskFilter === 'all' || 
      (riskFilter === 'critical' && assessment.initialRisk > 15) ||
      (riskFilter === 'high' && assessment.initialRisk > 10 && assessment.initialRisk <= 15) ||
      (riskFilter === 'medium' && assessment.initialRisk > 5 && assessment.initialRisk <= 10) ||
      (riskFilter === 'low' && assessment.initialRisk <= 5)

    return matchesSearch && matchesRiskFilter
  })

  const getRiskColorClass = (score: number) => {
    const color = getRiskColor(score)
    switch (color) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200'
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'orange': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'red': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      await deleteAssessment.mutateAsync(id)
    }
  }

  const handleExportPDF = async (id: number) => {
    await exportPDF.mutateAsync(id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Evaluaciones de Riesgo</h1>
              <p className="text-gray-600 mt-1">
                Gestiona y revisa todas las evaluaciones de riesgo realizadas
              </p>
            </div>
            <Button asChild>
              <a href="/risk-assessments/new">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Evaluación
              </a>
            </Button>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por peligro, tarea o responsable..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Riesgo
                  </label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los niveles</SelectItem>
                      <SelectItem value="critical">Crítico (16-25)</SelectItem>
                      <SelectItem value="high">Alto (11-15)</SelectItem>
                      <SelectItem value="medium">Medio (6-10)</SelectItem>
                      <SelectItem value="low">Bajo (1-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <p className="text-sm text-gray-500">
                    {filteredAssessments.length} de {riskAssessments.length} evaluaciones
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de evaluaciones */}
          <div className="space-y-4">
            {filteredAssessments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron evaluaciones
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || riskFilter !== 'all' 
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Aún no hay evaluaciones de riesgo registradas'
                    }
                  </p>
                  {!searchTerm && riskFilter === 'all' && (
                    <Button asChild>
                      <a href="/risk-assessments/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear primera evaluación
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredAssessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Información principal */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {assessment.hazard.name} - {assessment.task.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Responsable: {assessment.responsible.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColorClass(assessment.initialRisk)}`}>
                              {getRiskLevel(assessment.initialRisk)}
                            </div>
                          </div>
                        </div>

                        {/* Detalles */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {format(new Date(assessment.createdAt), 'dd/MM/yyyy', { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {assessment.user.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Riesgo inicial:</span>
                            <span className="font-medium ml-1">{assessment.initialRisk}</span>
                          </div>
                          {assessment.residualRisk && (
                            <div>
                              <span className="text-gray-500">Riesgo residual:</span>
                              <span className="font-medium ml-1">{assessment.residualRisk}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/risk-assessments/${assessment.id}`}>
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/risk-assessments/${assessment.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleExportPDF(assessment.id)}
                          disabled={exportPDF.isPending}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(assessment.id)}
                          disabled={deleteAssessment.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
