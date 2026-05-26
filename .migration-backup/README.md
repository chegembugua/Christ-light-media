# Christ Light Media

A full-stack Christian media platform built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Prisma.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **Deploy:** Vercel

## Design Tokens

| Token   | Value     |
|---------|-----------|
| Gold    | `#C8A24A` |
| Background | `#0A0A0A` |
| Surface | `#121212` |
| Card    | `#1A1A1A` |

## Getting Started

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in Supabase URL, anon key, and Postgres connection strings.
3. Install dependencies and push schema:
   ```bash
   npm install
   npx prisma db push
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Folder Structure

```
christ-light-media/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/
│   │   └── layout.tsx
│   ├── sermons/page.tsx
│   ├── podcasts/page.tsx
│   ├── music/page.tsx
│   ├── radio/page.tsx
│   ├── worship/page.tsx
│   ├── devotions/page.tsx
│   ├── news/page.tsx
│   ├── community/
│   │   ├── prayer/page.tsx
│   │   └── chat/page.tsx
│   ├── movement/page.tsx
│   ├── school/
│   │   ├── page.tsx
│   │   └── [courseId]/lesson/[lessonId]/page.tsx
│   ├── give/page.tsx
│   └── profile/page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── media/
│   ├── player/
│   ├── animations/
│   ├── prayer/
│   └── notifications/
├── context/
│   ├── AuthContext.tsx
│   └── PlayerContext.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── middleware.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

## Protected Routes

| Route | Requirement |
|-------|-------------|
| `/profile/*` | Authenticated |
| `/admin/*` | Authenticated + `ADMIN` role |
| `/school/*/lesson/*` | Authenticated |
