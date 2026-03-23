import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Interior de sala con muebles de madera"
          fill
          className="object-cover"
          priority
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block text-sm font-medium text-primary-foreground/80 mb-4 tracking-widest uppercase">
            Fabricacion Artesanal
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight text-balance">
            Muebles a Medida para Tu Hogar
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl leading-relaxed">
            Disenamos y fabricamos muebles unicos con la mas alta calidad en maderas nobles. 
            Cada pieza es creada especialmente para ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-base cursor-pointer">
              <Link href="#catalogo">
                Ver Catalogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base cursor-pointer bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20">
              <Link href="#categorias">
                Explorar Categorias
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
