"use client"

import { useState } from 'react'
import { Loader2, X, Image as ImageIcon } from 'lucide-react'
import type { WoodType } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import Image from 'next/image'

interface WoodTypeFormProps {
  woodType: WoodType | null
  onSave: (data: Partial<WoodType>) => Promise<void>
  onCancel: () => void
}

export function WoodTypeForm({ woodType, onSave, onCancel }: WoodTypeFormProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    name: woodType?.name || '',
    description: woodType?.description || '',
  })
  
  const [existingImage, setExistingImage] = useState<string | null>(woodType?.image_url || null)
  const [newImage, setNewImage] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImage(e.target.files[0])
      setExistingImage(null) // Only one image per wood type
    }
  }

  const handleRemoveImage = () => {
    setExistingImage(null)
    setNewImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let imageUrl = existingImage
      
      if (newImage) {
        const fileExt = newImage.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('furniture') // using the same bucket
          .upload(fileName, newImage)
          
        if (!uploadError) {
          const { data } = supabase.storage.from('furniture').getPublicUrl(fileName)
          imageUrl = data.publicUrl
        }
      }
      
      await onSave({
        name: formData.name,
        description: formData.description || null,
        image_url: imageUrl || null
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const previewUrl = newImage ? URL.createObjectURL(newImage) : existingImage

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nombre de la madera *</FieldLabel>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej: Roble Blanco"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Descripción</FieldLabel>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Breve descripción del tipo de madera..."
            rows={3}
          />
        </Field>

        <Field>
          <FieldLabel>Imagen de la Textura (Opcional)</FieldLabel>
          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative aspect-square w-32 rounded-md overflow-hidden bg-muted border">
                <Image src={previewUrl} alt="Textura de madera" fill className="object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label htmlFor="wood-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="text-sm font-semibold">Cargar textura</span>
                </div>
                <Input 
                  id="wood-image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            )}
          </div>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || !formData.name}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Guardando...' : woodType ? 'Guardar Cambios' : 'Agregar'}
        </Button>
      </div>
    </form>
  )
}
