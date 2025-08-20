import { RiskAssessmentForm } from '@/components/risk-assessment-form'
import { Header } from '@/components/header'

export default function NewRiskAssessmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Nueva Evaluación de Riesgo</h1>
            <p className="text-gray-600 mt-2">
              Completa el formulario para crear una nueva evaluación de riesgo
            </p>
          </div>
          
          <RiskAssessmentForm 
            onSuccess={() => {
              // Redirigir a la lista de evaluaciones
              window.location.href = '/risk-assessments'
            }}
          />
        </div>
      </main>
    </div>
  )
}
