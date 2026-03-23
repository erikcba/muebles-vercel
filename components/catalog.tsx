"use client"

import { useState } from 'react'
import type { Furniture, Category } from '@/lib/types'
import { FurnitureCard } from '@/components/furniture-card'
import { CategoryFilter } from '@/components/category-filter'
import { ProductModal } from '@/components/product-modal'

interface CatalogProps {
  furniture: Furniture[]
  categories: Category[]
}

export function Catalog({ furniture, categories }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredFurniture = selectedCategory
    ? furniture.filter(item => item.category_id === selectedCategory)
    : furniture

  const handleViewDetails = (item: Furniture) => {
    setSelectedFurniture(item)
    setModalOpen(true)
  }

  return (
    <section id="catalogo" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestro Catalogo
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra seleccion de muebles artesanales. Cada pieza puede ser personalizada segun tus necesidades.
          </p>
        </div>

        <div className="flex justify-center mb-8" id="categorias">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {filteredFurniture.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay muebles en esta categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFurniture.map(item => (
              <FurnitureCard 
                key={item.id} 
                furniture={item} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal
        furniture={selectedFurniture}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  )
}
