"use client"

import Image from 'next/image'
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { Button } from '@/components/ui/button'
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'

const WHATSAPP_NUMBER = "5493513262380"

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const sendToWhatsApp = () => {
    const message = items
      .map(item => `- ${item.furniture.name} x${item.quantity} - ${formatPrice(item.furniture.price * item.quantity)}`)
      .join('\n')
    
    const fullMessage = `Hola! Me interesa realizar el siguiente pedido:\n\n${message}\n\n*Total: ${formatPrice(totalPrice)}*\n\n¿Podrian confirmar disponibilidad y tiempo de entrega?`
    
    const encodedMessage = encodeURIComponent(fullMessage)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    clearCart()
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full px-4">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="font-serif text-2xl">Tu Carrito</SheetTitle>
          <SheetDescription>Aun no hay productos</SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Tu carrito esta vacio</p>
            <p className="text-sm text-muted-foreground">
              Agrega muebles para comenzar tu pedido
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full px-4">
      <SheetHeader className="pb-4 border-b">
        <SheetTitle className="font-serif text-2xl">Tu Carrito</SheetTitle>
        <SheetDescription>
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
        </SheetDescription>
      </SheetHeader>

      {/* Lista de productos con mejor diseño */}
      <div className="flex-1 overflow-y-auto py-4 -mx-1 px-1">
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div 
              key={item.furniture.id} 
              className="flex gap-4 p-4 bg-card rounded-2xl border border-border/50 shadow-sm"
            >
              {/* Imagen del producto */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {item.furniture.image_url ? (
                  <Image
                    src={item.furniture.image_url}
                    alt={item.furniture.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Info del producto */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight">
                    {item.furniture.name}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer flex-shrink-0 -mt-1 -mr-1"
                    onClick={() => removeItem(item.furniture.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-primary font-bold mt-1">
                  {formatPrice(item.furniture.price)}
                </p>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <div className="flex items-center gap-1 bg-secondary rounded-full p-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full cursor-pointer hover:bg-background"
                      onClick={() => updateQuantity(item.furniture.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full cursor-pointer hover:bg-background"
                      onClick={() => updateQuantity(item.furniture.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {formatPrice(item.furniture.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con total y boton WhatsApp mejorado */}
      <div className="border-t pt-5 mt-auto space-y-4">
        {/* Total con fuente moderna */}
        <div className="flex justify-between items-center px-1">
          <span className="text-base text-muted-foreground">Total del pedido</span>
          <span className="text-3xl font-bold text-foreground tracking-tight">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* Boton WhatsApp mejorado */}
        <Button 
          onClick={sendToWhatsApp} 
          className="w-full h-14 bg-[#25D366] hover:bg-[#1da851] text-white cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <MessageCircle className="mr-3 h-6 w-6" />
          <span className="text-base font-bold tracking-wide">
            Enviar por WhatsApp
          </span>
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Se abrira WhatsApp con el resumen de tu pedido
        </p>
      </div>
    </div>
  )
}
