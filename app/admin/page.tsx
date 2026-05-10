import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()
  
  const furnitureRes = await supabase.from('furniture').select('*, categories(name), furniture_wood_types(wood_types(*))').order('created_at', { ascending: false })
  const categoriesRes = await supabase.from('categories').select('*').order('name')
  const woodTypesRes = await supabase.from('wood_types').select('*').order('name')

  const furniture = furnitureRes.data
  const categories = categoriesRes.data
  const woodTypes = woodTypesRes.data

  return (
    <AdminDashboard 
      initialFurniture={furniture || []}
      initialCategories={categories || []}
      initialWoodTypes={woodTypes || []}
    />
  )
}

