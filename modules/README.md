# Christ Light Media — Module Architecture

Each feature lives in `modules/<name>/` with a consistent layout:

```
modules/<name>/
├── types/          # TypeScript types & Zod schemas (future)
├── lib/            # Pure helpers (errors, validators)
├── services/       # Data access (client + server)
├── components/     # UI components ('use client' where needed)
├── hooks/          # React hooks
└── index.ts        # Public API — import only from here
```

**App routes** (`app/`) stay thin: metadata + re-export module pages.

## Build order (Phase 1 → 5)

| Phase | Module | Status |
|-------|--------|--------|
| 1 | `auth/` | ✅ Complete |
| 1 | `admin/` | Pending |
| 1 | `devotions/` | Pending |
| 1 | `media/` (upload) | Pending |
| 2 | `media/radio`, `music`, `worship`, `podcasts` | Pending |
| 3 | `movement/`, `prayers/`, `chat/` | Pending |
| 4 | `education/`, `donations/` | Pending |
| 5 | Live streaming, certificates, mobile | Pending |

## Import rule

```ts
// ✅ Good
import { LoginForm, type AuthUser } from '@/modules/auth';

// ❌ Avoid deep imports outside the module
import { LoginForm } from '@/modules/auth/components/LoginForm';
```
