import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface UserInteraction {
  id: string;
  user_id: string | null;
  session_id: string;
  event_type: string;
  page: string;
  event_target: string;
  details: string;
  timestamp: string;
} 