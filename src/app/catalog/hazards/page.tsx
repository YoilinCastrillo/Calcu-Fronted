'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Header } from '@/components/header'
import { useHazards, useCreateHazard, useUpdateHazard, useDeleteHazard } from '@/hooks/use-api'
import { hazardSchema, type Hazard } from '@/lib/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react'

// type guard: asegura que hazard tiene id numérico
function hasId(h: Hazard): h is Hazard & { id: number } {
  return typeof (h as any).id === "number";
}

const hazardCategories = [
  'Físico',
  'Químico',
  'Biológico',
  'Ergonómico',
  'Psicosocial',
  'Mecánico',
  'Eléctrico',
  'Otro'
]

export default function HazardsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHazard, setEditingHazard] = useState<Hazard & { id: number } | null>(null)
  
  const { data: hazards = [], isLoading } = useHazards()
  const createHazard = useCreateHazard()
  const updateHazard = useUpdateHazard()
  const deleteHazard = useDeleteHazard()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Hazard>({
    resolver: zodResolver(hazardSchema),
  })

  // Filtrar peligros
  const filteredHazards = hazards.filter(hazard => {
    const matchesSearch = hazard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hazard.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || hazard.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const onSubmit = async (data: Hazard) => {
    try {
      if (editingHazard && typeof editingHazard.id === "number") {
        await updateHazard.mutateAsync({ id: editingHazard.id, data });
      } else {
        await createHazard.mutateAsync(data);
      }
      
      reset()
      setIsFormOpen(false)
      setEditingHazard(null)
    } catch (error) {
      console.error('Error al guardar el peligro:', error)
    }
  }

  const handleEdit = (hazard: Hazard) => {
    if (!hasId(hazard)) return;   // si hazard no tiene id, no hace nada
    setEditingHazard(hazard);
    reset(hazard);
    setIsFormOpen(true);
  };
  

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este peligro?')) {
      await deleteHazard.mutateAsync(id)
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingHazard(null)
    reset()
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/catalog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </a>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Catálogo de Peligros</h1>
                <p className="text-gray-600 mt-1">
                  Gestiona los peligros identificados en la organización
                </p>
              </div>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Peligro
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
                      placeholder="Buscar por nombre o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {hazardCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <p className="text-sm text-gray-500">
                    {filteredHazards.length} de {hazards.length} peligros
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario */}
          {isFormOpen && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingHazard ? 'Editar Peligro' : 'Nuevo Peligro'}
                </CardTitle>
                <CardDescription>
                  Completa la información del peligro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <Input
                        {...register('name')}
                        placeholder="Nombre del peligro"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <Select onValueChange={(value) => register('category').onChange({ target: { value } })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {hazardCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Descripción detallada del peligro..."
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Guardando...' : editingHazard ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

       {/* Lista de peligros */}
<div className="space-y-4">
  {filteredHazards.length === 0 ? (
    <Card>
      <CardContent className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron peligros
        </h3>
        <p className="text-gray-500 mb-4">
          {searchTerm || categoryFilter !== 'all'
            ? 'Intenta ajustar los filtros de búsqueda'
            : 'Aún no hay peligros registrados'}
        </p>
        {!searchTerm && categoryFilter === 'all' && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear primer peligro
          </Button>
        )}
      </CardContent>
    </Card>
  ) : (
    filteredHazards.map((hazard, i) => (
      <Card
        key={hasId(hazard) ? hazard.id : i}
        className="hover:shadow-md transition-shadow"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {hazard.name}
                </h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {hazard.category}
                </span>
              </div>
              {hazard.description && (
                <p className="text-gray-600 text-sm">{hazard.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(hazard)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => hasId(hazard) && handleDelete(hazard.id)}
                disabled={deleteHazard.isPending}
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
