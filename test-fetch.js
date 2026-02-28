fetch('https://rvauujtkuwofmlctnglz.supabase.co/rest/v1/')
  .then(res => console.log('HTTP Status:', res.status))
  .catch(e => console.error('Error:', e.message));
