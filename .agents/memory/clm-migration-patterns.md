---
name: Christ Light Media Migration Patterns
description: Next.js→Vite+wouter migration patterns and recurring issues in the christ-light-media artifact
---

## Key patterns that caused runtime crashes

**searchParams**: Next.js `useSearchParams()` was stripped from imports but usages left behind. Replace with `new URLSearchParams(window.location.search)` at the top of component body.

**router**: Next.js `useRouter()` references must be replaced with `const [, navigate] = useLocation()` from wouter. `router.refresh()` has no equivalent — delete it (no-op is fine).

**Supabase noop client**: When `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are unset, `createNoopClient()` must include ALL auth methods (signInWithPassword, signInWithOAuth, signUp, signOut, resetPasswordForEmail, updateUser) or "is not a function" crashes occur.

**Server components**: Any `export async function` component that calls Prisma or server-only helpers must be rewritten to use `fetch('/api/...')` with useState/useEffect.

**Fetch error handling**: Always check `response.ok` BEFORE calling `.json()` — a 502 empty body will throw "Unexpected end of JSON input" if you call `.json()` first.

**Why**: This project was migrated from Next.js App Router where server components, useSearchParams, and useRouter are first-class. Vite+wouter requires full client-side patterns.
