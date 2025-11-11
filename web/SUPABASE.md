# Supabase Integration (Frontend)

This React app supports two modes:
- REAL mode: Uses Supabase Auth via @supabase/supabase-js
- MOCK mode: Local-only auth, no network calls

AuthContext automatically selects MOCK mode if Supabase env vars are missing.

## Environment variables

Create `web/.env` with:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_MOCK_MODE=false
```

Notes:
- Variables must be prefixed with `REACT_APP_` to be visible to CRA.
- `REACT_APP_FRONTEND_URL` is used as `emailRedirectTo` during sign-up. If omitted, it falls back to the browser origin.

## Client factory

The client is created in `src/lib/supabaseClient.js`. If env vars are not present, a stub is returned so the app runs without errors in MOCK mode.

## Usage

`AuthContext` imports `getSupabaseClient()` and handles:
- Session retrieval (`auth.getSession`)
- Auth state changes (`auth.onAuthStateChange`)
- Sign-in/up/out

No additional code changes are required to toggle modes; provide env vars to switch to REAL mode.
