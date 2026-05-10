"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import type { WoodType } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { WoodTypeForm } from '@/components/admin/wood-type-form'

interface WoodTypeManagerProps {
  woodTypes: WoodType[]
  onWoodTypesChange: (woodTypes: WoodType[]) => void
}

export function WoodTypeManager({ woodTypes, onWoodTypesChange }: WoodTypeManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWoodType, setEditingWoodType] = useState<WoodType | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const handleSave = async (data: Partial<WoodType>) => {
    if (editingWoodType) {
      const { data: updated, error } = await supabase
        .from('wood_types')
        .update({
          name: data.name,
          description: data.description,
          image_url: data.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingWoodType.id)
        .select()
        .single()

      if (!error && updated) {
        onWoodTypesChange(woodTypes.map(w => w.id === updated.id ? updated as WoodType : w))
      }
    } else {
      const { data: created, error } = await supabase
        .from('wood_types')
        .insert({
          name: data.name,
          description: data.description,
          image_url: data.image_url
        })
        .select()
        .single()

      if (!error && created) {
        onWoodTypesChange([...woodTypes, created as WoodType].sort((a, b) => a.name.localeCompare(b.name)))
      }
    }
    setIsDialogOpen(false)
    setEditingWoodType(null)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await supabase.from('wood_types').delete().eq('id', id)
    if (!error) {
      onWoodTypesChange(woodTypes.filter(w => w.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tipos de Madera</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingWoodType(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Madera
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editingWoodType ? 'Editar Tipo de Madera' : 'Agregar Tipo de Madera'}
              </DialogTitle>
              <DialogDescription>
                {editingWoodType 
                  ? 'Modifica los datos del tipo de madera.' 
                  : 'Agrega un nuevo tipo de madera para usar en tus muebles.'}
              </DialogDescription>
            </DialogHeader>
            <WoodTypeForm
              woodType={editingWoodType}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {woodTypes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay tipos de madera. Agrega el primero.
          </p>
        ) : (
          <div className="space-y-3">
            {woodTypes.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-1">
                      Sin img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.name}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingWoodType(item)
                      setIsDialogOpen(true)
                    }}
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
                        <AlertDialogTitle>Eliminar tipo de madera</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente &ldquo;{item.name}&rdquo;.
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
