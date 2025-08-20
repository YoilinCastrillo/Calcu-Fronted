import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User,
  Plus,
  Settings
} from 'lucide-react'

const catalogItems = [
  {
    title: 'Peligros',
    description: 'Gestiona el catálogo de peligros identificados en la organización',
    icon: AlertTriangle,
    href: '/catalog/hazards',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    title: 'Tareas',
    description: 'Administra las actividades y tareas que se evalúan',
    icon: Clock,
    href: '/catalog/tasks',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    title: 'Controles',
    description: 'Gestiona las medidas de control disponibles',
    icon: CheckCircle,
    href: '/catalog/controls',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    title: 'Responsables',
    description: 'Administra los responsables de las evaluaciones',
    icon: User,
    href: '/catalog/responsibles',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
]

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Catálogos</h1>
            <p className="text-gray-600 mt-2">
              Gestiona los catálogos de peligros, tareas, controles y responsables
            </p>
          </div>

          {/* Grid de catálogos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catalogItems.map((item) => (
              <Card 
                key={item.title} 
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${item.borderColor}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`h-8 w-8 ${item.color}`} />
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={item.href}>
                        <Settings className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <a href={item.href}>
                      <Plus className="h-4 w-4 mr-2" />
                      Gestionar {item.title}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Información adicional */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Información sobre los Catálogos</CardTitle>
              <CardDescription>
                Los catálogos son la base para realizar evaluaciones de riesgo efectivas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">¿Por qué son importantes?</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Estandarizan la identificación de peligros</li>
                    <li>• Facilitan la evaluación consistente</li>
                    <li>• Permiten el seguimiento de controles</li>
                    <li>• Mejoran la gestión de responsabilidades</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Mantén los catálogos actualizados</li>
                    <li>• Revisa periódicamente la efectividad</li>
                    <li>• Documenta cambios y mejoras</li>
                    <li>• Capacita al personal en su uso</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
