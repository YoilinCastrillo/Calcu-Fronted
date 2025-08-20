'use client'

import { RISK_MATRIX, getProbabilityDescription, getSeverityDescription } from '@/lib/risk-calculator'
import { cn } from '@/lib/utils'

interface RiskMatrixProps {
  selectedProbability?: number
  selectedSeverity?: number
  onSelect?: (probability: number, severity: number) => void
  className?: string
}

export function RiskMatrix({ 
  selectedProbability, 
  selectedSeverity, 
  onSelect,
  className 
}: RiskMatrixProps) {
  const getCellColor = (probability: number, severity: number) => {
    const cell = RISK_MATRIX[probability - 1][severity - 1]
    const isSelected = selectedProbability === probability && selectedSeverity === severity
    
    const baseColors = {
      green: 'bg-green-100 border-green-300',
      yellow: 'bg-yellow-100 border-yellow-300',
      orange: 'bg-orange-100 border-orange-300',
      red: 'bg-red-100 border-red-300'
    }
    
    const selectedColors = {
      green: 'bg-green-200 border-green-500 ring-2 ring-green-500',
      yellow: 'bg-yellow-200 border-yellow-500 ring-2 ring-yellow-500',
      orange: 'bg-orange-200 border-orange-500 ring-2 ring-orange-500',
      red: 'bg-red-200 border-red-500 ring-2 ring-red-500'
    }
    
    const colors = isSelected ? selectedColors : baseColors
    return colors[cell.color]
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Matriz de Riesgo</h3>
        <p className="text-sm text-gray-600">
          Selecciona la probabilidad y severidad para calcular el nivel de riesgo
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1 max-w-2xl mx-auto">
        {/* Header de severidad */}
        <div className="col-span-1" />
        {[1, 2, 3, 4, 5].map((severity) => (
          <div key={severity} className="text-center p-2">
            <div className="text-sm font-medium text-gray-700">{severity}</div>
            <div className="text-xs text-gray-500">Severidad</div>
          </div>
        ))}

        {/* Filas de probabilidad */}
        {[1, 2, 3, 4, 5].map((probability) => (
          <div key={probability} className="contents">
            {/* Label de probabilidad */}
            <div className="text-center p-2 flex flex-col justify-center">
              <div className="text-sm font-medium text-gray-700">{probability}</div>
              <div className="text-xs text-gray-500">Probabilidad</div>
            </div>

            {/* Celdas de la matriz */}
            {[1, 2, 3, 4, 5].map((severity) => {
              const cell = RISK_MATRIX[probability - 1][severity - 1]
              const isSelected = selectedProbability === probability && selectedSeverity === severity
              
              return (
                <button
                  key={severity}
                  onClick={() => onSelect?.(probability, severity)}
                  className={cn(
                    "p-3 border-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    getCellColor(probability, severity),
                    onSelect && "cursor-pointer",
                    !onSelect && "cursor-default"
                  )}
                  title={`Probabilidad ${probability} - Severidad ${severity}: ${cell.level} (${cell.score})`}
                >
                  <div className="text-center">
                    <div className={cn(
                      "text-lg font-bold",
                      cell.color === 'green' && "text-green-800",
                      cell.color === 'yellow' && "text-yellow-800",
                      cell.color === 'orange' && "text-orange-800",
                      cell.color === 'red' && "text-red-800"
                    )}>
                      {cell.score}
                    </div>
                    <div className="text-xs font-medium text-gray-700">
                      {cell.level}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span className="text-sm text-gray-700">Bajo (1-5)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
          <span className="text-sm text-gray-700">Medio (6-10)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
          <span className="text-sm text-gray-700">Alto (11-15)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span className="text-sm text-gray-700">Crítico (16-25)</span>
        </div>
      </div>

      {/* Descripciones */}
      {selectedProbability && selectedSeverity && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Descripción del Riesgo Seleccionado</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Probabilidad {selectedProbability}:</strong>
              <p className="text-gray-600">{getProbabilityDescription(selectedProbability)}</p>
            </div>
            <div>
              <strong>Severidad {selectedSeverity}:</strong>
              <p className="text-gray-600">{getSeverityDescription(selectedSeverity)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
