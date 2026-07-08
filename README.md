# Grow CRM — AI-Powered CSV Importer

Production-grade CRM contact importer with AI-assisted column mapping, Zod validation, and batched processing.

## Architecture

Feature-based layout with clear separation of concerns:

```
src/
├── app/                    # Next.js routes & API
├── features/
│   ├── csv-import/         # Upload, validation, import flow
│   └── ai-mapping/         # AI column mapping & batching
└── shared/
    ├── components/         # Reusable UI, table, layout
    ├── hooks/              # useOptimisticMutation, useMediaQuery
    └── lib/                # API client, logger, retry
```

## Features

- **AI column mapping** — Pattern + sample-value inference with batched API calls for large files
- **Zod validation** — Strict contact schema with row-level error reporting
- **Optimistic UI** — Import progress updates immediately via React Query
- **Retry mechanism** — Exponential backoff on API failures
- **Structured logging** — JSON logs with feature/action context
- **Error boundaries** — Graceful fallbacks per feature
- **Responsive dashboard** — Mobile-friendly SaaS layout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run lint`  | ESLint                   |
| `npm run typecheck` | TypeScript check     |

## Import Flow

1. **Upload** — Drop or select a CSV file
2. **Mapping** — AI suggests CRM field mappings (editable)
3. **Preview** — Validate rows and review errors
4. **Import** — Batched server-side processing with live progress

## Tech Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- TanStack Query & Table
- Zod
- Framer Motion (step transitions)
- Tailwind CSS 4
