import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? (() => { throw new Error('Missing SUPABASE_URL') })();;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? (() => { throw new Error('Missing SUPABASE_API_KEY') })();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);