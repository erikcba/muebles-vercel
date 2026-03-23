import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/cart-provider'
import './globals.css'

const dmSerif = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: '--font-serif' });
const dmSans = DM_Sans({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Muebles Artesanales | Fabrica de Muebles a Medida',
  description: 'Diseñamos y fabricamos muebles a medida con la más alta calidad. Descubre nuestra colección de muebles artesanales.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${dmSerif.variable} ${dmSans.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
