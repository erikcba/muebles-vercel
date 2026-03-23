import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Catalog } from '@/components/catalog'
import { Footer } from '@/components/footer'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  
  const [{ data: furniture }, { data: categories }] = await Promise.all([
    supabase.from('furniture').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name')
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Catalog 
          furniture={furniture || []} 
          categories={categories || []} 
        />
      </main>
      <Footer />
    </div>
  )
}
