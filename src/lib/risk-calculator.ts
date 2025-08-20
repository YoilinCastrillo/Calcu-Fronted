import { RiskMatrix } from './schemas'

// Matriz de riesgo 5x5
export const RISK_MATRIX: RiskMatrix[][] = [
  [
    { probability: 1, severity: 1, score: 1, color: 'green', level: 'Bajo' },
    { probability: 1, severity: 2, score: 2, color: 'green', level: 'Bajo' },
    { probability: 1, severity: 3, score: 3, color: 'yellow', level: 'Medio' },
    { probability: 1, severity: 4, score: 4, color: 'yellow', level: 'Medio' },
    { probability: 1, severity: 5, score: 5, color: 'orange', level: 'Alto' },
  ],
  [
    { probability: 2, severity: 1, score: 2, color: 'green', level: 'Bajo' },
    { probability: 2, severity: 2, score: 4, color: 'yellow', level: 'Medio' },
    { probability: 2, severity: 3, score: 6, color: 'yellow', level: 'Medio' },
    { probability: 2, severity: 4, score: 8, color: 'orange', level: 'Alto' },
    { probability: 2, severity: 5, score: 10, color: 'orange', level: 'Alto' },
  ],
  [
    { probability: 3, severity: 1, score: 3, color: 'yellow', level: 'Medio' },
    { probability: 3, severity: 2, score: 6, color: 'yellow', level: 'Medio' },
    { probability: 3, severity: 3, score: 9, color: 'orange', level: 'Alto' },
    { probability: 3, severity: 4, score: 12, color: 'red', level: 'Crítico' },
    { probability: 3, severity: 5, score: 15, color: 'red', level: 'Crítico' },
  ],
  [
    { probability: 4, severity: 1, score: 4, color: 'yellow', level: 'Medio' },
    { probability: 4, severity: 2, score: 8, color: 'orange', level: 'Alto' },
    { probability: 4, severity: 3, score: 12, color: 'red', level: 'Crítico' },
    { probability: 4, severity: 4, score: 16, color: 'red', level: 'Crítico' },
    { probability: 4, severity: 5, score: 20, color: 'red', level: 'Crítico' },
  ],
  [
    { probability: 5, severity: 1, score: 5, color: 'orange', level: 'Alto' },
    { probability: 5, severity: 2, score: 10, color: 'orange', level: 'Alto' },
    { probability: 5, severity: 3, score: 15, color: 'red', level: 'Crítico' },
    { probability: 5, severity: 4, score: 20, color: 'red', level: 'Crítico' },
    { probability: 5, severity: 5, score: 25, color: 'red', level: 'Crítico' },
  ],
]

// Función para calcular el riesgo inicial
export function calculateInitialRisk(probability: number, severity: number): RiskMatrix {
  if (probability < 1 || probability > 5 || severity < 1 || severity > 5) {
    throw new Error('La probabilidad y severidad deben estar entre 1 y 5')
  }
  
  return RISK_MATRIX[probability - 1][severity - 1]
}

// Función para calcular el riesgo residual
export function calculateResidualRisk(
  initialRisk: number,
  controlEffectiveness: number
): number {
  // El riesgo residual se reduce según la efectividad de los controles
  // controlEffectiveness debe estar entre 0 y 1
  const effectiveness = Math.max(0, Math.min(1, controlEffectiveness))
  return Math.round(initialRisk * (1 - effectiveness))
}

// Función para obtener el color del riesgo
export function getRiskColor(score: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (score <= 5) return 'green'
  if (score <= 10) return 'yellow'
  if (score <= 15) return 'orange'
  return 'red'
}

// Función para obtener el nivel de riesgo
export function getRiskLevel(score: number): 'Bajo' | 'Medio' | 'Alto' | 'Crítico' {
  if (score <= 5) return 'Bajo'
  if (score <= 10) return 'Medio'
  if (score <= 15) return 'Alto'
  return 'Crítico'
}

// Función para generar recomendaciones automáticas
export function generateRecommendations(riskScore: number): string[] {
  const recommendations: string[] = []
  
  if (riskScore <= 5) {
    recommendations.push(
      'Mantener los controles existentes',
      'Revisar periódicamente la efectividad de los controles',
      'Documentar las buenas prácticas'
    )
  } else if (riskScore <= 10) {
    recommendations.push(
      'Implementar controles adicionales',
      'Capacitar al personal en los procedimientos',
      'Establecer monitoreo regular',
      'Revisar los controles cada 6 meses'
    )
  } else if (riskScore <= 15) {
    recommendations.push(
      'Implementar controles inmediatos',
      'Reducir la exposición al riesgo',
      'Capacitación obligatoria del personal',
      'Monitoreo diario de las condiciones',
      'Revisar los controles cada mes',
      'Considerar cambios en el proceso'
    )
  } else {
    recommendations.push(
      'SUSPENDER la actividad inmediatamente',
      'Implementar controles de emergencia',
      'Revisar completamente el proceso',
      'Capacitación intensiva del personal',
      'Monitoreo continuo',
      'Considerar automatización o cambio de proceso',
      'Notificar a la dirección'
    )
  }
  
  return recommendations
}

// Función para obtener la descripción de probabilidad
export function getProbabilityDescription(level: number): string {
  const descriptions = {
    1: 'Muy improbable (menos de una vez al año)',
    2: 'Improbable (una vez al año)',
    3: 'Posible (una vez al mes)',
    4: 'Probable (una vez a la semana)',
    5: 'Muy probable (diario)'
  }
  return descriptions[level as keyof typeof descriptions] || 'Nivel no válido'
}

// Función para obtener la descripción de severidad
export function getSeverityDescription(level: number): string {
  const descriptions = {
    1: 'Sin lesión (solo daños materiales menores)',
    2: 'Lesión menor (primeros auxilios)',
    3: 'Lesión moderada (atención médica)',
    4: 'Lesión grave (hospitalización)',
    5: 'Fatal (muerte o incapacidad permanente)'
  }
  return descriptions[level as keyof typeof descriptions] || 'Nivel no válido'
}
