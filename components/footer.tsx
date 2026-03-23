import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Artesano</h3>
            <p className="text-background/70 leading-relaxed">
              Fabricamos muebles a medida con la más alta calidad. 
              Cada pieza es única y creada especialmente para ti.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-background/70 hover:text-background transition-colors">
                Inicio
              </Link>
              <Link href="/#catalogo" className="text-background/70 hover:text-background transition-colors">
                Catálogo
              </Link>
              <Link href="/#categorias" className="text-background/70 hover:text-background transition-colors">
                Categorías
              </Link>
              <Link href="/admin" className="text-background/70 hover:text-background transition-colors">
                Admin
              </Link>
            </nav>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="flex flex-col gap-3 text-background/70">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+54 9 11 2345-6789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contacto@artesano.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/50 text-sm">
          <p>Muebles Artesano. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
