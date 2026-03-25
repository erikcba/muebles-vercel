"use client"

import { useState } from 'react'
import { Loader2, Plus, Trash2, X, Image as ImageIcon } from 'lucide-react'
import type { Furniture, Category } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'

interface FurnitureFormProps {
  furniture: Furniture | null
  categories: Category[]
  onSave: (data: Partial<Furniture>) => Promise<void>
  onCancel: () => void
}

export function FurnitureForm({ furniture, categories, onSave, onCancel }: FurnitureFormProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    name: furniture?.name || '',
    description: furniture?.description || '',
    price: furniture?.price || 0,
    category_id: furniture?.category_id || '',
    dimensions: furniture?.dimensions || '',
    materials: furniture?.materials || '',
  })
  
  const [existingImages, setExistingImages] = useState<string[]>(
    furniture?.image_url ? furniture.image_url.split(',').filter(url => url.trim() !== '') : []
  )
  const [newImages, setNewImages] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files!)])
      // Reset input so the same files can be selected again if removed
      e.target.value = ''
    }
  }

  const handleRemoveExisting = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveNew = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const uploadedUrls: string[] = []
      
      // Subir cada imagen nueva a Supabase Storage
      for (const file of newImages) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('furniture')
          .upload(filePath, file)
          
        if (uploadError) {
          console.error("Error al subir imagen:", uploadError)
          continue
        }
        
        const { data } = supabase.storage
          .from('furniture')
          .getPublicUrl(filePath)
          
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl)
        }
      }
      
      const combinedUrls = [...existingImages, ...uploadedUrls]
      
      const data: Partial<Furniture> = {
        name: formData.name,
        description: formData.description || null,
        price: Number(formData.price),
        image_url: combinedUrls.length > 0 ? combinedUrls.join(',') : null,
        category_id: formData.category_id || null,
        dimensions: formData.dimensions || null,
        materials: formData.materials || null,
      }
      
      await onSave(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
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
          <FieldLabel>Imágenes</FieldLabel>
          <div className="space-y-4">
            {/* Image Previews */}
            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Existing Images */}
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative group aspect-square rounded-md overflow-hidden bg-muted border">
                    <Image src={url} alt={`Imagen ${index + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(index)}
                      className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-destructive hover:text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-[10px] items-center px-1 py-0.5 flex truncate">
                      Actual
                    </div>
                  </div>
                ))}
                
                {/* New Images */}
                {newImages.map((file, index) => (
                  <div key={`new-${index}`} className="relative group aspect-square rounded-md overflow-hidden bg-muted border border-primary/50">
                    <Image src={URL.createObjectURL(file)} alt={file.name} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNew(index)}
                      className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-destructive hover:text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] items-center px-1 py-0.5 flex truncate">
                      Nueva
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Button */}
            <div className="flex items-center justify-center w-full">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted border-border transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold px-2">Haz clic para subir imágenes</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG o WEBP</p>
                </div>
                <Input 
                  id="image-upload" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || !formData.name}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Guardando...' : furniture ? 'Guardar Cambios' : 'Crear Mueble'}
        </Button>
      </div>
    </form>
  )
}
