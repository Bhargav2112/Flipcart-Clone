import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file to get Supabase credentials
const envPath = path.resolve(__dirname, '.env');
const envFile = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envFile.split('\n').filter(Boolean).forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    let val = rest.join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    envVars[key.trim()] = val;
  }
});

const url = envVars.VITE_SUPABASE_URL;
const key = envVars.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials in .env file.");
  process.exit(1);
}

const supabase = createClient(url, key);

const categories = ['Electronics', 'Fashion', 'Home & Furniture', 'Appliances', 'Mobiles', 'Beauty', 'Grocery', 'Toys'];
const products = [];

console.log("Generating 100 products...");

for (let i = 1; i <= 100; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  let thumbnail = '';
  
  // Assign thumbnails based on category
  if (category === 'Mobiles') thumbnail = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400';
  else if (category === 'Fashion') thumbnail = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400';
  else if (category === 'Electronics') thumbnail = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400';
  else if (category === 'Home & Furniture') thumbnail = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400';
  else if (category === 'Appliances') thumbnail = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=400';
  else if (category === 'Beauty') thumbnail = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400';
  else if (category === 'Grocery') thumbnail = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';
  else if (category === 'Toys') thumbnail = 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=400';

  const price = Math.floor(Math.random() * 50000) + 500;
  const original_price = price + Math.floor(Math.random() * 5000) + 500;
  
  products.push({
    name: `Premium ${category} Item ${i}`,
    description: `This is a high quality ${category} item designed for the modern lifestyle. Built to last with premium materials.`,
    price: price,
    original_price: original_price,
    thumbnail: thumbnail,
    images: [thumbnail],
    status: 'approved',
    is_deal: Math.random() > 0.8,
    is_featured: Math.random() > 0.8,
    is_bestseller: Math.random() > 0.8,
    is_trending: Math.random() > 0.8,
    category: category,
    seller_name: 'FlipKart Verified'
  });
}

async function seed() {
  console.log(`Starting insertion of ${products.length} products to Supabase...`);
  
  // Insert in batches of 20
  for (let i = 0; i < products.length; i += 20) {
    const batch = products.slice(i, i + 20);
    const { data, error } = await supabase.from('Product').insert(batch);
    
    if (error) {
      console.error(`Error inserting batch ${i / 20 + 1}:`, error.message);
    } else {
      console.log(`✅ Successfully inserted batch ${i / 20 + 1} (${batch.length} items)`);
    }
  }
  
  console.log('Done!');
}

seed();
