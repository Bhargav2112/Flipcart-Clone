import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rvauujtkuwofmlctnglz.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2YXV1anRrdXdvZm1sY3RuZ2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTMxNTAsImV4cCI6MjA4NzgyOTE1MH0.WBVvxxZk75H8xzjk9jTFSWHr8SFf0EPrR7lE3dfW5uw';

const supabase = createClient(supabaseUrl, anonKey);

async function testFetch() {
  console.log('Fetching products...');
  const { data, error } = await supabase.from('Product').select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log(`Successfully fetched ${data.length} products.`);
    if (data.length > 0) {
      console.log('First product status:', data[0].status);
    }
  }
}

testFetch();
