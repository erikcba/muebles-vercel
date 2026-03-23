"use client"

import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, Check, X } from 'lucide-react'
import type { Category } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface CategoryManagerProps {
  categories: Category[]
  onCategoriesChange: (categories: Category[]) => void
}

export function CategoryManager({ categories, onCategoriesChange }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newCategoryName.trim() })
      .select()
      .single()

    if (!error && data) {
      onCategoriesChange([...categories, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewCategoryName('')
    }
    setLoading(false)
  }

  const handleEdit = async (id: string) => {
    if (!editingName.trim()) return

    const { data, error } = await supabase
      .from('categories')
      .update({ name: editingName.trim() })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      onCategoriesChange(
        categories.map(c => c.id === id ? data : c).sort((a, b) => a.name.localeCompare(b.name))
      )
    }
    setEditingId(null)
    setEditingName('')
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) {
      onCategoriesChange(categories.filter(c => c.id !== id))
    }
    setDeletingId(null)
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleCreate} className="flex gap-2">
          <Input
            placeholder="Nueva categoría..."
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newCategoryName.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </>
            )}
          </Button>
        </form>

        {categories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay categorías. Agrega la primera.
          </p>
        ) : (
          <div className="space-y-2">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                {editingId === category.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      className="flex-1"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleEdit(category.id)
                        if (e.key === 'Escape') cancelEditing()
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category.id)}
                      disabled={!editingName.trim()}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{category.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          {deletingId === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Los muebles en esta categoría quedarán sin categoría asignada.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
