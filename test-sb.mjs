import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Fetching furniture...")
  const furnitureRes = await supabase.from('furniture').select('*, categories(name), furniture_wood_types(wood_types(*))').order('created_at', { ascending: false })
  console.log("Furniture error:", furnitureRes.error)
  console.log("Furniture data length:", furnitureRes.data?.length)
  
  if (furnitureRes.error) {
    console.error("Detailed Error:", JSON.stringify(furnitureRes.error, null, 2))
  }

  console.log("Fetching wood types...")
  const woodTypesRes = await supabase.from('wood_types').select('*').order('name')
  console.log("WoodTypes error:", woodTypesRes.error)
  console.log("WoodTypes data length:", woodTypesRes.data?.length)
}

test()
