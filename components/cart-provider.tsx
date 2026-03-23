"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Furniture, CartItem } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  addItem: (furniture: Furniture, quantity?: number) => void
  removeItem: (furnitureId: string) => void
  updateQuantity: (furnitureId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((furniture: Furniture, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.furniture.id === furniture.id)
      if (existing) {
        return prev.map(item =>
          item.furniture.id === furniture.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { furniture, quantity }]
    })
  }, [])

  const removeItem = useCallback((furnitureId: string) => {
    setItems(prev => prev.filter(item => item.furniture.id !== furnitureId))
  }, [])

  const updateQuantity = useCallback((furnitureId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(furnitureId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.furniture.id === furnitureId ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.furniture.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
