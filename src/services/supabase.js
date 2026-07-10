import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://neccldqauqrfxtwcdzfa.supabase.co';

// Clean, complete publishable anon key block
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lY2NsZHFhdXFyZnh0d2NkemZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA2MDIwNjksImV4cCI6MjAzNjE3ODA2OX0.sb_publishable_n8r17_H_gE4vL2Xf6Q9XhM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);