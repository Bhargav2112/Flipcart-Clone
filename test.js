import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yurytjsvtistpjqitanw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cnl0anN2dGlzdHBqcWl0YW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzgzODEsImV4cCI6MjA4Nzc1NDM4MX0.htSRv6PlrWxXZEbHTsUdyg2VFepiL802bYBTzVu8N8o';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('Product').select('*');
  console.log('Product data count:', data?.length, 'error:', error);
  
  if (data?.length === 0) {
    // maybe no status: 'approved' ? Let's check without filter
      const { data: dataunfiltered } = await supabase.from('Product').select('*');
      console.log('Product data unfiltered count:', dataunfiltered?.length);
  }
}
test();
