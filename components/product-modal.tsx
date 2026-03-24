"use client"

import Image from 'next/image'
import { useState } from 'react'
import { Minus, Plus, ShoppingCart, Ruler, Tag, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Furniture } from '@/lib/types'
import { useCart } from '@/components/cart-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ProductModalProps {
  furniture: Furniture | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductModal({ furniture, open, onOpenChange }: ProductModalProps) {
  const { addItem, items } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!furniture) return null

  const cartItem = items.find(item => item.furniture.id === furniture.id)
  const currentCartQuantity = cartItem?.quantity || 0

  const images = furniture.image_url ? furniture.image_url.split(',') : []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(furniture)
    }
    setQuantity(1)
    onOpenChange(false)
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[1000px] w-full max-h-[95vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{furniture.name}</DialogTitle>
          <DialogDescription>
            Detalles del producto {furniture.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid lg:grid-cols-2 overflow-hidden">
          {/* Galeria de Imagenes - Mejorada */}
          <div className="relative bg-muted/30">
            {/* Imagen Principal Grande */}
            <div className="relative aspect-[4/3] lg:aspect-square">
              {images.length > 0 ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={furniture.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                  Sin imagen
                </div>
              )}
              


              {/* Navegacion de imagenes */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full cursor-pointer shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full cursor-pointer shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4 justify-center bg-background/50 backdrop-blur-sm">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      currentImageIndex === index 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${furniture.name} - Vista ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informacion del Producto */}
          <div className="p-6 lg:p-10 flex flex-col overflow-y-auto max-h-[60vh] lg:max-h-[95vh]">
            <div className="flex-1">
              {/* Categoria badge */}
              {furniture.category && (
                <Badge variant="secondary" className="mb-3 text-xs">
                  {furniture.category.name}
                </Badge>
              )}

              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4 text-balance">
                {furniture.name}
              </h2>
              
              <p className="text-3xl lg:text-4xl font-bold text-primary mb-6 tracking-tight">
                {formatPrice(furniture.price)}
              </p>

              {furniture.description && (
                <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                  {furniture.description}
                </p>
              )}

              {/* Caracteristicas con mejor diseño */}
              <div className="grid gap-4 mb-8">
                {furniture.dimensions && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <Ruler className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Dimensiones</span>
                      <p className="font-semibold text-foreground">{furniture.dimensions}</p>
                    </div>
                  </div>
                )}


              </div>

              {currentCartQuantity > 0 && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-6">
                  <p className="text-sm text-primary font-medium">
                    Ya tienes {currentCartQuantity} unidad(es) en tu carrito
                  </p>
                </div>
              )}
            </div>

            {/* Controles de Cantidad y Agregar */}
            <div className="space-y-5 pt-6 border-t border-border/50 mt-auto">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Cantidad</span>
                <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-full cursor-pointer hover:bg-background"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-14 text-center text-lg font-bold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-10 w-10 rounded-full cursor-pointer hover:bg-background"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <span className="font-medium text-muted-foreground">Subtotal</span>
                <span className="text-2xl font-bold text-primary tracking-tight">
                  {formatPrice(furniture.price * quantity)}
                </span>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full h-14 text-base font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
