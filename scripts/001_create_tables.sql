-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de muebles/productos
CREATE TABLE IF NOT EXISTS furniture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  dimensions TEXT,
  materials TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE furniture ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura (cualquiera puede ver el catálogo)
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read furniture" ON furniture FOR SELECT USING (true);

-- Políticas de administrador (usando service role o authenticated users con rol admin)
-- Por simplicidad, permitimos todas las operaciones para usuarios autenticados
CREATE POLICY "Allow authenticated insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update categories" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete categories" ON categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert furniture" ON furniture FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update furniture" ON furniture FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete furniture" ON furniture FOR DELETE TO authenticated USING (true);

-- Insertar datos de ejemplo
INSERT INTO categories (name, description, image_url) VALUES
  ('Mesas', 'Mesas de comedor, centro y auxiliares hechas a medida', 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800'),
  ('Sillas', 'Sillas de diseño exclusivo para cada espacio', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'),
  ('Estanterías', 'Sistemas de almacenamiento y exhibición personalizados', 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'),
  ('Camas', 'Camas y cabeceras artesanales de alta calidad', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800');

-- Insertar muebles de ejemplo
INSERT INTO furniture (name, description, price, image_url, category_id, dimensions, materials) VALUES
  ('Mesa Nordic', 'Mesa de comedor minimalista con acabado natural', 1850.00, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800', (SELECT id FROM categories WHERE name = 'Mesas'), '180 x 90 x 75 cm', 'Roble macizo, acabado mate'),
  ('Mesa Centro Origami', 'Mesa de centro con diseño geométrico único', 750.00, 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800', (SELECT id FROM categories WHERE name = 'Mesas'), '120 x 60 x 45 cm', 'Nogal, metal negro'),
  ('Silla Atelier', 'Silla ergonómica con respaldo curvado', 450.00, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800', (SELECT id FROM categories WHERE name = 'Sillas'), '45 x 50 x 85 cm', 'Fresno, tapizado lino'),
  ('Silla Vintage', 'Silla de comedor con estilo retro moderno', 380.00, 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', (SELECT id FROM categories WHERE name = 'Sillas'), '42 x 48 x 82 cm', 'Haya, tapizado terciopelo'),
  ('Estantería Modular', 'Sistema modular adaptable a cualquier espacio', 1200.00, 'https://images.unsplash.com/photo-1597072689227-8882273e8f6a?w=800', (SELECT id FROM categories WHERE name = 'Estanterías'), '200 x 35 x 180 cm', 'Pino, herrajes latón'),
  ('Biblioteca Escalera', 'Estantería con escalera integrada', 2100.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', (SELECT id FROM categories WHERE name = 'Estanterías'), '250 x 40 x 220 cm', 'Roble, hierro forjado'),
  ('Cama Platform', 'Cama con base flotante y cabecera tapizada', 2400.00, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800', (SELECT id FROM categories WHERE name = 'Camas'), '200 x 180 x 100 cm', 'Nogal, lino natural'),
  ('Cama Minimal', 'Diseño limpio con almacenamiento oculto', 1950.00, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', (SELECT id FROM categories WHERE name = 'Camas'), '200 x 160 x 35 cm', 'Roble blanqueado');
