import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }

  return client;
}

export function getSupabaseClientWithToken(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
