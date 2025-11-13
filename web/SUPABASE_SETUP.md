# Supabase setup (web)

Create a .env file from .env.example and set:
- REACT_APP_SUPABASE_URL=https://your-project.supabase.co
- REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
- (optional) REACT_APP_FRONTEND_URL=https://your-frontend.example.com

Import the client in your React code:
  import { getSupabaseClient } from './src/lib/supabaseClient';
  const supabase = getSupabaseClient();

Notes:
- If env vars are missing or REACT_APP_MOCK_MODE === 'true', the client falls back to a safe mock and the app runs in MOCK mode.
- Ensure the file exists at: web/src/lib/supabaseClient.js

If the project uses Vite, switch to:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
and replace process.env usage with import.meta.env in the client file.
