# Supabase setup (web)

Create a .env file from .env.example and set:
- REACT_APP_SUPABASE_URL=https://your-project.supabase.co
- REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key

Import the client in your React code:
  import { getBrowserClient } from './src/lib/supabase';
  const supabase = getBrowserClient();

If the project uses Vite, switch to:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
and replace process.env usage with import.meta.env in src/lib/supabase.ts.
