import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://neccldqauqrfxtwcdzfa.supabase.co';

// Fully complete and authenticated signature anon token block
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lY2NsZHFhdXFyZnh0d2NkemZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjE0MjQsImV4cCI6MjA5OTIzNzQyNH0.__0ZnLQ_GAV1XJ-JsYQRdJHWamm0A6SN37OjtEGirSI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);