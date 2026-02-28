const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rvauujtkuwofmlctnglz.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2YXV1anRrdXdvZm1sY3RuZ2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTMxNTAsImV4cCI6MjA4NzgyOTE1MH0.WBVvxxZk75H8xzjk9jTFSWHr8SFf0EPrR7lE3dfW5uw';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2YXV1anRrdXdvZm1sY3RuZ2x6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI1MzE1MCwiZXhwIjoyMDg3ODI5MTUwfQ.CAn_E41Q_xKddV4lu8u28buF0aBXctH7te7xVn5B2v0';

const anonSupabase = createClient(supabaseUrl, anonKey);
const serviceSupabase = createClient(supabaseUrl, serviceKey);

async function testProducts() {
  console.log('--- Testing with Anonymous Key (What the app uses) ---');
  const { data: anonData, error: anonError } = await anonSupabase.from('Product').select('*');
  console.log('Anonymous Error:', anonError?.message || 'None');
  console.log('Anonymous Data Count:', anonData ? anonData.length : 0);

  console.log('\n--- Testing with Service Key (Bypasses RLS) ---');
  const { data: serviceData, error: serviceError } = await serviceSupabase.from('Product').select('*');
  console.log('Service Error:', serviceError?.message || 'None');
  console.log('Service Data Count:', serviceData ? serviceData.length : 0);
  
  if (serviceData && serviceData.length > 0) {
      console.log('Sample Product (Service Key):', serviceData[0].name, 'Status:', serviceData[0].status);
  }
}

testProducts();
