"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import type { Furniture, Category } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { FurnitureForm } from '@/components/admin/furniture-form'

interface FurnitureManagerProps {
  furniture: (Furniture & { categories: { name: string } | null })[]
  categories: Category[]
  onFurnitureChange: (furniture: (Furniture & { categories: { name: string } | null })[]) => void
}

export function FurnitureManager({ furniture, categories, onFurnitureChange }: FurnitureManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFurniture, setEditingFurniture] = useState<Furniture | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSave = async (data: Partial<Furniture>) => {
    if (editingFurniture) {
      const { data: updated, error } = await supabase
        .from('furniture')
        .update(data)
        .eq('id', editingFurniture.id)
        .select('*, categories(name)')
        .single()

      if (!error && updated) {
        onFurnitureChange(furniture.map(f => f.id === updated.id ? updated : f))
      }
    } else {
      const { data: created, error } = await supabase
        .from('furniture')
        .insert(data)
        .select('*, categories(name)')
        .single()

      if (!error && created) {
        onFurnitureChange([created, ...furniture])
      }
    }
    setIsDialogOpen(false)
    setEditingFurniture(null)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await supabase.from('furniture').delete().eq('id', id)
    if (!error) {
      onFurnitureChange(furniture.filter(f => f.id !== id))
    }
    setDeletingId(null)
  }

  const openEditDialog = (item: Furniture) => {
    setEditingFurniture(item)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingFurniture(null)
    setIsDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Muebles</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Mueble
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editingFurniture ? 'Editar Mueble' : 'Agregar Mueble'}
              </DialogTitle>
              <DialogDescription>
                {editingFurniture ? 'Modifica los datos del mueble seleccionado.' : 'Completa el formulario para agregar un nuevo mueble al catalogo.'}
              </DialogDescription>
            </DialogHeader>
            <FurnitureForm
              furniture={editingFurniture}
              categories={categories}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {furniture.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay muebles. Agrega el primero.
          </p>
        ) : (
          <div className="space-y-3">
            {furniture.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {item.image_url ? (
                    <Image
                      src={item.image_url.split(',')[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      Sin img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-primary font-semibold">
                      {formatPrice(item.price)}
                    </span>
                    {item.categories?.name && (
                      <Badge variant="secondary" className="text-xs">
                        {item.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        {deletingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar mueble</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente &ldquo;{item.name}&rdquo; del catálogo.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
