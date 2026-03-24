"use client"

import { useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import type { Furniture, Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FurnitureFormProps {
  furniture: Furniture | null
  categories: Category[]
  onSave: (data: Partial<Furniture>) => Promise<void>
  onCancel: () => void
}

export function FurnitureForm({ furniture, categories, onSave, onCancel }: FurnitureFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: furniture?.name || '',
    description: furniture?.description || '',
    price: furniture?.price || 0,
    imageUrls: furniture?.image_url ? furniture.image_url.split(',') : [''],
    category_id: furniture?.category_id || '',
    dimensions: furniture?.dimensions || '',
    materials: furniture?.materials || '',
  })

  const handleAddImageUrl = () => {
    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }))
  }

  const handleRemoveImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const handleImageUrlChange = (index: number, value: string) => {
    setFormData(prev => {
      const newUrls = [...prev.imageUrls]
      newUrls[index] = value
      return { ...prev, imageUrls: newUrls }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const data: Partial<Furniture> = {
      name: formData.name,
      description: formData.description || null,
      price: Number(formData.price),
      image_url: formData.imageUrls.filter(url => url.trim() !== '').join(',') || null,
      category_id: formData.category_id || null,
      dimensions: formData.dimensions || null,
      materials: formData.materials || null,
    }
    
    await onSave(data)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nombre *</FieldLabel>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Mesa de Comedor Rústica"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Descripción</FieldLabel>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe el mueble..."
            rows={3}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="price">Precio (ARS) *</FieldLabel>
          <Input
            id="price"
            type="number"
            min="0"
            step="100"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Categoría</FieldLabel>
          <Select
            value={formData.category_id}
            onValueChange={value => setFormData(prev => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>URLs de Imágenes</FieldLabel>
          <div className="space-y-3">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="url"
                  value={url}
                  onChange={e => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.imageUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveImageUrl(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={handleAddImageUrl}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar otra imagen
            </Button>
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="dimensions">Dimensiones</FieldLabel>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={e => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
            placeholder="180cm x 90cm x 75cm"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="materials">Materiales</FieldLabel>
          <Input
            id="materials"
            value={formData.materials}
            onChange={e => setFormData(prev => ({ ...prev, materials: e.target.value }))}
            placeholder="Roble macizo"
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || !formData.name}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {furniture ? 'Guardar Cambios' : 'Crear Mueble'}
        </Button>
      </div>
    </form>
  )
}
