import { createClient } from '@supabase/supabase-js';

// Hardcode the URLs directly so Vite cannot pass an empty variable to the client initializer
const supabaseUrl = 'https://neccldqauqrfxtwcdzfa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lY2NsZHFhdXFyZnh0d2NkemZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA2MDIwNjksImV4cCI6MjAzNjE3ODA2OX0.sb_publishable_n8r17_H_gE4vL2Xf6Q9XhM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);