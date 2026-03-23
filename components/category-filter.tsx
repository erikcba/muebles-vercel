"use client"

import type { Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(null)}
        className={cn(
          "rounded-full cursor-pointer",
          selectedCategory === null && "bg-primary text-primary-foreground"
        )}
      >
        Todos
      </Button>
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "rounded-full cursor-pointer",
            selectedCategory === category.id && "bg-primary text-primary-foreground"
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
