"use client"

import { useState } from 'react'
import { Sofa, FolderTree } from 'lucide-react'
import type { Furniture, Category } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FurnitureManager } from '@/components/admin/furniture-manager'
import { CategoryManager } from '@/components/admin/category-manager'

interface AdminDashboardProps {
  initialFurniture: (Furniture & { categories: { name: string } | null })[]
  initialCategories: Category[]
}

export function AdminDashboard({ initialFurniture, initialCategories }: AdminDashboardProps) {
  const [furniture, setFurniture] = useState(initialFurniture)
  const [categories, setCategories] = useState(initialCategories)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Gestionar Catálogo</h2>
        <p className="text-muted-foreground mt-1">
          Agrega, edita o elimina muebles y categorías de tu catálogo
        </p>
      </div>

      <Tabs defaultValue="furniture" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="furniture" className="gap-2">
            <Sofa className="h-4 w-4" />
            Muebles ({furniture.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="h-4 w-4" />
            Categorías ({categories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="furniture">
          <FurnitureManager 
            furniture={furniture}
            categories={categories}
            onFurnitureChange={setFurniture}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager
            categories={categories}
            onCategoriesChange={setCategories}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
