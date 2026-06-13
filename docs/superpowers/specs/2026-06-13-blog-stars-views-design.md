# Blog Stars & View Counts — Design Spec

**Date:** 2026-06-13
**Status:** Approved

## Overview

Add two public-facing engagement features to the blog:

1. **View counts** — each blog post page records a view on load; counts are shown on both the post page and the blog list cards
2. **Star button** — anonymous visitors can star a post (like GitHub stars); counts shown in both locations; one star per browser via `localStorage`

## Architecture

```
Browser
  ├── GET  /.netlify/functions/stats?slug=xxx         → { views, stars }
  ├── GET  /.netlify/functions/stats?slugs=a,b,c      → { a: {...}, b: {...} }
  ├── POST /.netlify/functions/view  { slug }         → { views: N }
  └── POST /.netlify/functions/star  { slug, action } → { stars: N }

Netlify Functions (@upstash/redis)
  └── Upstash Redis
        views:{slug}  → integer
        stars:{slug}  → integer
```

### Netlify Functions

Three functions in `netlify/functions/`:

| File | Method | Purpose |
|---|---|---|
| `stats.mts` | GET | Return `{ views, stars }` for one slug or a bulk map for multiple slugs |
| `view.mts` | POST | Atomically `INCR views:{slug}`, return new count |
| `star.mts` | POST | Atomically `INCR` or `DECR stars:{slug}` based on `action`, return new count |

All functions use `@upstash/redis` with REST transport (no persistent TCP connection — correct for serverless).

### Environment Variables (Netlify dashboard)

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Data Model

Redis keys per blog post slug:

```
views:first-week-at-kms-technology   → 342
stars:first-week-at-kms-technology   → 17
```

Atomic `INCR`/`DECR` ensures correctness under concurrent requests.

## UI & Interaction

### Blog Post Page (`/blog/[slug]`)

- Stats row appears in the post header, next to the publish date
- Format: `☆ 12  ·  243 views`
- Star button toggles between ☆ (not starred) and ★ (starred)
- Star state persisted in `localStorage` as `starred:{slug}` = `"1"`
- Clicking star: optimistic UI update → POST `/star` → on failure, revert
- View counted on every page load via POST `/view` (no dedup — each visit increments)

### Blog List Page (`/blog`)

- Each `PostCard` shows read-only: `☆ 12  ·  243 views`
- Single bulk request: `GET /stats?slugs=slug1,slug2,...` on page load
- No star interaction on the list — display only

### Component

**`BlogStats.tsx`** — React component (consistent with existing `TagFilter.tsx`):

```
Props (post page):   { slug: string, interactive: true }
Props (list card):   { slug: string, interactive: false, initialStats?: Stats }
```

Used with `client:load` in both locations. Shows `--` placeholder while loading.

## Error Handling

| Scenario | Behaviour |
|---|---|
| `/stats` fetch fails | Counts stay as `--`, no error shown to visitors |
| `/star` POST fails | Optimistic update reverted, button returns to previous state |
| `/view` POST fails | Silently swallowed — a missed count is not user-visible |
| localStorage unavailable | Star state defaults to unstarred; starring still works, dedup is skipped |

## Constraints & Limits

- **Upstash free tier**: 10k commands/day. Each post visit = 2 commands (INCR + GET). Each star = 2 commands. Comfortable for a personal blog.
- **Star dedup**: localStorage only — clearing browser storage allows re-starring. Acceptable trade-off for a personal blog.
- **No auth required**: Stars are anonymous. Netlify Identity is not involved.

## Out of Scope

- Per-post analytics dashboard
- Spam protection / rate limiting beyond localStorage dedup
- Showing who starred (no identity attached to stars)
