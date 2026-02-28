import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rvauujtkuwofmlctnglz.supabase.co';
// Using Service Role Key to bypass RLS and insert smoothly
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2YXV1anRrdXdvZm1sY3RuZ2x6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI1MzE1MCwiZXhwIjoyMDg3ODI5MTUwfQ.CAn_E41Q_xKddV4lu8u28buF0aBXctH7te7xVn5B2v0';
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = ['electronics', 'fashion', 'home-furniture', 'appliances', 'mobiles', 'beauty', 'grocery', 'toys'];
const brandsMap = {
  'electronics': ['Sony', 'Samsung', 'LG', 'Panasonic', 'Philips'],
  'mobiles': ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Motorola'],
  'fashion': ['Nike', 'Adidas', 'Puma', 'Zara', 'H&M'],
  'home-furniture': ['IKEA', 'Godrej', 'Sleepwell', 'Urban Ladder', 'Pepperfry'],
  'appliances': ['Whirlpool', 'LG', 'Samsung', 'Bosch', 'IFB'],
  'beauty': ['L\'Oreal', 'Maybelline', 'MAC', 'Lakme', 'Nivea'],
  'grocery': ['Nestle', 'Cadbury', 'Amul', 'Britannia', 'Haldirams'],
  'toys': ['Lego', 'Hot Wheels', 'Barbie', 'Fisher-Price', 'Nerf']
};

const adjectives = ['Premium', 'Pro', 'Ultra', 'Smart', 'Classic', 'Luxury', 'Advanced', 'High-Performance', 'Essential', 'Wireless', 'Portable'];
const nouns = {
  'electronics': ['Headphones', 'Speaker', 'TV', 'Monitor', 'Camera', 'Tablet'],
  'mobiles': ['Smartphone', 'Pro Max', 'Fold', 'Ultra', 'Lite'],
  'fashion': ['Sneakers', 'T-Shirt', 'Jacket', 'Jeans', 'Watch', 'Backpack'],
  'home-furniture': ['Sofa', 'Dining Table', 'Bed', 'Chair', 'Bookshelf', 'Lamp'],
  'appliances': ['Refrigerator', 'Washing Machine', 'Microwave', 'Air Conditioner', 'Vacuum Cleaner'],
  'beauty': ['Face Wash', 'Moisturizer', 'Perfume', 'Lipstick', 'Sunscreen'],
  'grocery': ['Coffee', 'Tea', 'Chocolates', 'Almonds', 'Honey'],
  'toys': ['Action Figure', 'Puzzle', 'Board Game', 'Doll', 'RC Car']
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProduct(index) {
  const category = categories[randomInt(0, categories.length - 1)];
  const brandList = brandsMap[category];
  const nounList = nouns[category];
  
  const brand = brandList[randomInt(0, brandList.length - 1)];
  const adjective = adjectives[randomInt(0, adjectives.length - 1)];
  const noun = nounList[randomInt(0, nounList.length - 1)];
  
  const name = `${brand} ${adjective} ${noun} ${randomInt(100, 9999)}`;
  const description = `Experience the best quality with the ${name}. Perfectly designed for your everyday needs. Highly rated and loved by thousands.`;
  
  const originalPrice = randomInt(500, 50000);
  const discountPercent = randomInt(5, 50);
  const price = Math.round(originalPrice * (1 - discountPercent / 100));
  
  // Use loremflickr with random to ensure different pictures per product
  // Add an index to bypass browser caching for thumbnails
  const categorySlug = category === 'home-furniture' ? 'furniture' : category;
  const thumbnail = `https://loremflickr.com/500/500/${categorySlug}?random=${index}`;
  
  const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
  const rating_count = randomInt(10, 5000);
  
  return {
    name,
    description,
    price,
    original_price: originalPrice,
    thumbnail,
    category,
    brand,
    rating: parseFloat(rating),
    rating_count,
    is_deal: Math.random() > 0.8,
    is_featured: Math.random() > 0.9,
    is_bestseller: Math.random() > 0.85,
    is_trending: Math.random() > 0.85,
    status: 'approved',
  };
}

async function seedDatabase() {
  console.log('Generating 1000 mock products...');
  const totalProducts = 1000;
  const batchSize = 100;
  let successCount = 0;
  
  try {
    for (let i = 0; i < totalProducts; i += batchSize) {
      const batch = [];
      for (let j = 0; j < batchSize; j++) {
        if (i + j < totalProducts) {
          batch.push(generateProduct(i + j));
        }
      }
      
      console.log(`Inserting batch ${i / batchSize + 1}...`);
      const { error } = await supabase.from('Product').insert(batch);
      
      if (error) {
        console.error('Error in batch insert:', error);
        break;
      }
      successCount += batch.length;
    }
    
    console.log(`\n✅ Successfully generated and inserted ${successCount} products into Supabase!`);
  } catch (err) {
    console.error('Failed to seed:', err);
  }
}

seedDatabase();
