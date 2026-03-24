import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/admin/logout-button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Catálogo
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="font-serif text-xl font-bold max-sm:hidden">Panel de Administración</h1>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
