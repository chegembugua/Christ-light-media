# Christ Light Media — Module Architecture

Each feature lives in `modules/<name>/` with a consistent layout:

```
modules/<name>/
├── types/          # TypeScript types
├── lib/            # Pure helpers
├── services/       # Client-side API calls
├── server/         # Prisma & server-only logic
├── components/     # UI
└── index.ts        # Public API
```

## Phase 1 — Foundation ✅

| Module | Status | Routes |
|--------|--------|--------|
| `auth/` | ✅ | `/login`, `/register`, `/profile`, … |
| `admin/` | ✅ | `/admin`, sidebar dashboard |
| `devotions/` | ✅ | `/devotions`, `/admin/devotions` |
| `media/` | ✅ | `/sermons` (published), `/admin/media` |

### Admin setup

1. Set a user’s `role` to `ADMIN` in the database.
2. Create a **public** Supabase Storage bucket named `media`.
3. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` for uploads.

### API (admin)

- `GET/POST /api/admin/devotions`
- `GET/PATCH/DELETE /api/admin/devotions/[id]`
- `GET/POST /api/admin/media` (multipart upload)
- `PATCH/DELETE /api/admin/media/[id]`

## Phase 2+ (next)

Media sub-modules (radio scheduler, music library), community, education, donations.
