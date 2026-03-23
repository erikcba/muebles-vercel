"use client"

import Image from 'next/image'
import { Plus, Check, Ruler, Eye } from 'lucide-react'
import { useState } from 'react'
import type { Furniture } from '@/lib/types'
import { useCart } from '@/components/cart-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FurnitureCardProps {
  furniture: Furniture
  onViewDetails: (furniture: Furniture) => void
}

export function FurnitureCard({ furniture, onViewDetails }: FurnitureCardProps) {
  const { addItem, items } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  
  const isInCart = items.some(item => item.furniture.id === furniture.id)
  const cartItem = items.find(item => item.furniture.id === furniture.id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(furniture)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <Card 
      className="group overflow-hidden border-border/50 py-0 hover:border-primary/30 transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={() => onViewDetails(furniture)}
    >
      {/* Imagen pegada al borde superior - sin padding */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {furniture.image_url ? (
          <Image
            src={furniture.image_url}
            alt={furniture.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
        
        {/* Badges y overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {furniture.is_custom && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            A Medida
          </Badge>
        )}
        
        {/* Botón ver detalles en hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            variant="secondary" 
            size="sm" 
            className="cursor-pointer shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(furniture)
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalles
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-serif font-semibold text-lg text-foreground mb-1 line-clamp-1">
          {furniture.name}
        </h3>
        {furniture.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {furniture.description}
          </p>
        )}
        
        {/* Dimensiones con icono de regla */}
        {furniture.dimensions && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Ruler className="h-3.5 w-3.5" />
            <span>{furniture.dimensions}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">
          {formatPrice(furniture.price)}
        </span>
        <Button
          onClick={handleAddToCart}
          size="sm"
          variant={isInCart ? "secondary" : "default"}
          className="transition-all cursor-pointer"
        >
          {justAdded ? (
            <>
              <Check className="mr-1 h-4 w-4" />
              Agregado
            </>
          ) : isInCart ? (
            <>
              <Plus className="mr-1 h-4 w-4" />
              Agregar ({cartItem?.quantity})
            </>
          ) : (
            <>
              <Plus className="mr-1 h-4 w-4" />
              Agregar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
