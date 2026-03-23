import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()
  
  const [{ data: furniture }, { data: categories }] = await Promise.all([
    supabase.from('furniture').select('*, categories(name)').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name')
  ])

  return (
    <AdminDashboard 
      initialFurniture={furniture || []}
      initialCategories={categories || []}
    />
  )
}
