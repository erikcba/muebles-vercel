"use client"

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/components/cart-provider'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CartSheet } from '@/components/cart-sheet'

export function Header() {
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-primary">Artesano</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
              Inicio
            </Link>
            <Link href="/#catalogo" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
              Catalogo
            </Link>
            <Link href="/#categorias" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
              Categorias
            </Link>
            <Link href="/admin" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <CartSheet />
              </SheetContent>
            </Sheet>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">
                    Inicio
                  </Link>
                  <Link href="/#catalogo" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">
                    Catálogo
                  </Link>
                  <Link href="/#categorias" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">
                    Categorías
                  </Link>
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">
                    Admin
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
