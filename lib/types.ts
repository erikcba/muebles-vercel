export interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Furniture {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string | null
  dimensions: string | null
  materials: string | null
  is_available: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface CartItem {
  furniture: Furniture
  quantity: number
}
