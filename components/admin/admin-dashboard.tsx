"use client"

import { useState } from 'react'
import { Sofa, FolderTree, TreePine } from 'lucide-react'
import type { Furniture, Category, WoodType } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FurnitureManager } from '@/components/admin/furniture-manager'
import { CategoryManager } from '@/components/admin/category-manager'
import { WoodTypeManager } from '@/components/admin/wood-type-manager'

interface AdminDashboardProps {
  initialFurniture: (Furniture & { categories: { name: string } | null, furniture_wood_types?: { wood_types: WoodType }[] })[]
  initialCategories: Category[]
  initialWoodTypes: WoodType[]
}

export function AdminDashboard({ initialFurniture, initialCategories, initialWoodTypes }: AdminDashboardProps) {
  const [furniture, setFurniture] = useState(initialFurniture)
  const [categories, setCategories] = useState(initialCategories)
  const [woodTypes, setWoodTypes] = useState(initialWoodTypes)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Gestionar Catálogo</h2>
        <p className="text-muted-foreground mt-1">
          Agrega, edita o elimina muebles, categorías y tipos de madera de tu catálogo
        </p>
      </div>

      <Tabs defaultValue="furniture" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="furniture" className="gap-2">
            <Sofa className="h-4 w-4" />
            Muebles ({furniture.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="h-4 w-4" />
            Categorías ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="wood-types" className="gap-2">
            <TreePine className="h-4 w-4" />
            Maderas ({woodTypes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="furniture">
          <FurnitureManager 
            furniture={furniture}
            categories={categories}
            woodTypes={woodTypes}
            onFurnitureChange={setFurniture}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager
            categories={categories}
            onCategoriesChange={setCategories}
          />
        </TabsContent>

        <TabsContent value="wood-types">
          <WoodTypeManager
            woodTypes={woodTypes}
            onWoodTypesChange={setWoodTypes}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
