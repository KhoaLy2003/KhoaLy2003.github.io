# Blog Stars & View Counts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add public view counts and anonymous star buttons to blog posts, displayed on both individual post pages and the blog list.

**Architecture:** Three Netlify Functions (stats/view/star) serve as the API layer backed by Upstash Redis, which stores atomic integer counters per blog slug. A Preact `BlogStats` component renders counts on the post page; `TagFilter.tsx` fetches a single bulk stats payload for all posts on the blog list.

**Tech Stack:** Netlify Functions v2 (TypeScript `.mts`), `@upstash/redis`, Preact, Astro

---

## File Map

**Create:**
- `netlify/functions/stats.mts` — GET: returns `{ views, stars }` for one slug, or a map for many slugs
- `netlify/functions/view.mts` — POST: atomically `INCR views:{slug}`
- `netlify/functions/star.mts` — POST: `INCR` or `DECR stars:{slug}` based on `action`
- `src/components/BlogStats.tsx` — Preact component: fetches counts on mount, renders star button + counts, handles optimistic star toggle

**Modify:**
- `netlify.toml` — add `[functions]` directory block
- `package.json` — add `@upstash/redis` dependency
- `.gitignore` — add `.env`
- `src/pages/blog/[slug].astro` — add `<BlogStats>` in interactive mode + fire view POST on load
- `src/components/TagFilter.tsx` — bulk-fetch stats on mount; render counts inside each card

---

### Task 1: Install dependencies and configure Netlify functions

**Files:**
- Modify: `netlify.toml`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Install @upstash/redis**

```bash
npm install @upstash/redis
```

Expected: `"@upstash/redis"` appears in `package.json` `dependencies`.

- [ ] **Step 2: Add functions directory to netlify.toml**

Open `netlify.toml` and append the `[functions]` block so the full file reads:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"
```

- [ ] **Step 3: Add .env to .gitignore**

Open `.gitignore` and add `.env` on its own line:

```
node_modules/
dist/
.astro/
.superpowers/
draft/
.env
```

- [ ] **Step 4: Create functions directory**

```bash
mkdir -p netlify/functions
```

- [ ] **Step 5: Commit**

```bash
git add netlify.toml package.json package-lock.json .gitignore
git commit -m "feat: add @upstash/redis and configure netlify functions"
```

---

### Task 2: Create the `stats` Netlify function

> **Note:** The test steps in Tasks 2–4 require a live Upstash database and a `.env` file. If you haven't done Task 8 yet, complete Steps 1–4 of Task 8 first, then come back here.

**Files:**
- Create: `netlify/functions/stats.mts`

This function is the read path. It supports:
- `GET ?slug=xxx` → `{ views: N, stars: N }`
- `GET ?slugs=a,b,c` → `{ a: { views, stars }, b: { views, stars }, ... }`

Slugs with no Redis key yet return `0`.

- [ ] **Step 1: Create netlify/functions/stats.mts**

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async (req: Request) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const slugsParam = url.searchParams.get("slugs");

  if (slug) {
    const [views, stars] = await Promise.all([
      redis.get<number>(`views:${slug}`),
      redis.get<number>(`stars:${slug}`),
    ]);
    return Response.json({ views: views ?? 0, stars: stars ?? 0 });
  }

  if (slugsParam) {
    const slugs = slugsParam.split(",").filter(Boolean);
    if (slugs.length === 0) {
      return Response.json({});
    }
    const keys = slugs.flatMap((s) => [`views:${s}`, `stars:${s}`]);
    const values = await redis.mget<number[]>(...keys);
    const result: Record<string, { views: number; stars: number }> = {};
    slugs.forEach((s, i) => {
      result[s] = {
        views: values[i * 2] ?? 0,
        stars: values[i * 2 + 1] ?? 0,
      };
    });
    return Response.json(result);
  }

  return Response.json({ error: "missing slug or slugs param" }, { status: 400 });
};
```

- [ ] **Step 2: Test manually**

First install Netlify CLI if not already installed:
```bash
npm install -g netlify-cli
```

Start dev server (in a separate terminal — leave it running for subsequent tasks):
```bash
netlify dev
```

Then test the single-slug path (use one of your actual post slugs):
```bash
curl "http://localhost:8888/.netlify/functions/stats?slug=first-week-at-kms-technology"
```

Expected:
```json
{"views":0,"stars":0}
```

Test the bulk path:
```bash
curl "http://localhost:8888/.netlify/functions/stats?slugs=first-week-at-kms-technology,building-otaku-community"
```

Expected:
```json
{"first-week-at-kms-technology":{"views":0,"stars":0},"building-otaku-community":{"views":0,"stars":0}}
```

- [ ] **Step 3: Commit**

```bash
git add netlify/functions/stats.mts
git commit -m "feat: add stats netlify function"
```

---

### Task 3: Create the `view` Netlify function

**Files:**
- Create: `netlify/functions/view.mts`

Accepts `POST { slug: string }`. Atomically increments `views:{slug}` and returns the new count.

- [ ] **Step 1: Create netlify/functions/view.mts**

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "method not allowed" }, { status: 405 });
  }

  const { slug } = (await req.json()) as { slug?: string };
  if (!slug) {
    return Response.json({ error: "missing slug" }, { status: 400 });
  }

  const views = await redis.incr(`views:${slug}`);
  return Response.json({ views });
};
```

- [ ] **Step 2: Test manually (netlify dev must be running)**

```bash
curl -X POST "http://localhost:8888/.netlify/functions/view" \
  -H "Content-Type: application/json" \
  -d '{"slug":"first-week-at-kms-technology"}'
```

Expected (count increments on each call):
```json
{"views":1}
```

Run it again — expected `{"views":2}`.

- [ ] **Step 3: Commit**

```bash
git add netlify/functions/view.mts
git commit -m "feat: add view counter netlify function"
```

---

### Task 4: Create the `star` Netlify function

**Files:**
- Create: `netlify/functions/star.mts`

Accepts `POST { slug: string, action: "star" | "unstar" }`. Stars increment the counter; unstars decrement but floor at 0.

- [ ] **Step 1: Create netlify/functions/star.mts**

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "method not allowed" }, { status: 405 });
  }

  const { slug, action } = (await req.json()) as {
    slug?: string;
    action?: "star" | "unstar";
  };

  if (!slug || !action) {
    return Response.json({ error: "missing slug or action" }, { status: 400 });
  }

  let stars: number;
  if (action === "star") {
    stars = await redis.incr(`stars:${slug}`);
  } else {
    const current = (await redis.get<number>(`stars:${slug}`)) ?? 0;
    stars = current > 0 ? await redis.decr(`stars:${slug}`) : 0;
  }

  return Response.json({ stars });
};
```

- [ ] **Step 2: Test manually (netlify dev must be running)**

Star a post:
```bash
curl -X POST "http://localhost:8888/.netlify/functions/star" \
  -H "Content-Type: application/json" \
  -d '{"slug":"first-week-at-kms-technology","action":"star"}'
```

Expected: `{"stars":1}`

Unstar it:
```bash
curl -X POST "http://localhost:8888/.netlify/functions/star" \
  -H "Content-Type: application/json" \
  -d '{"slug":"first-week-at-kms-technology","action":"unstar"}'
```

Expected: `{"stars":0}`

Unstar again when already at 0 (should not go negative):
```bash
curl -X POST "http://localhost:8888/.netlify/functions/star" \
  -H "Content-Type: application/json" \
  -d '{"slug":"first-week-at-kms-technology","action":"unstar"}'
```

Expected: `{"stars":0}`

- [ ] **Step 3: Commit**

```bash
git add netlify/functions/star.mts
git commit -m "feat: add star toggle netlify function"
```

---

### Task 5: Create the BlogStats Preact component

**Files:**
- Create: `src/components/BlogStats.tsx`

**Important:** This project uses **Preact**, not React. Import hooks from `preact/hooks`.

The component:
1. On mount: fetches `/stats?slug={slug}` for current counts
2. On mount: reads `localStorage` to set initial starred state
3. Renders `☆ N · N views` (or `★ N` when starred)
4. On star click: optimistic UI update → POST `/star` → revert on failure

- [ ] **Step 1: Create src/components/BlogStats.tsx**

```tsx
import { useState, useEffect } from 'preact/hooks';

interface Stats {
  views: number;
  stars: number;
}

interface Props {
  slug: string;
  interactive: boolean;
}

const storageKey = (slug: string) => `starred:${slug}`;

export default function BlogStats({ slug, interactive }: Props) {
  const [stats, setStats] = useState<Stats>({ views: 0, stars: 0 });
  const [starred, setStarred] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setStarred(localStorage.getItem(storageKey(slug)) === '1');
    } catch {}

    fetch(`/.netlify/functions/stats?slug=${slug}`)
      .then((r) => r.json())
      .then((data: Stats) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  async function toggleStar() {
    const action = starred ? 'unstar' : 'star';
    const nextStarred = !starred;

    // Optimistic update
    setStarred(nextStarred);
    setStats((s) => ({ ...s, stars: s.stars + (nextStarred ? 1 : -1) }));
    try {
      localStorage.setItem(storageKey(slug), nextStarred ? '1' : '0');
    } catch {}

    const res = await fetch('/.netlify/functions/star', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, action }),
    });

    if (!res.ok) {
      // Revert on failure
      setStarred(starred);
      setStats((s) => ({ ...s, stars: s.stars + (nextStarred ? -1 : 1) }));
      try {
        localStorage.setItem(storageKey(slug), starred ? '1' : '0');
      } catch {}
    } else {
      const { stars } = (await res.json()) as { stars: number };
      setStats((s) => ({ ...s, stars }));
    }
  }

  const starCount = loading ? '--' : String(stats.stars);
  const viewCount = loading ? '--' : String(stats.views);

  return (
    <span class="inline-flex items-center gap-3 text-sm text-dim font-mono">
      {interactive ? (
        <button
          onClick={toggleStar}
          aria-label={starred ? 'Unstar this post' : 'Star this post'}
          class={`inline-flex items-center gap-1 transition-colors ${
            starred ? 'text-accent' : 'hover:text-ink'
          }`}
        >
          {starred ? '★' : '☆'} {starCount}
        </button>
      ) : (
        <span class="inline-flex items-center gap-1">
          ☆ {starCount}
        </span>
      )}
      <span>·</span>
      <span>{viewCount} views</span>
    </span>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run check
```

Expected: no errors related to `BlogStats.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/BlogStats.tsx
git commit -m "feat: add BlogStats preact component"
```

---

### Task 6: Add BlogStats to the blog post page

**Files:**
- Modify: `src/pages/blog/[slug].astro`

Two changes: (1) render `<BlogStats>` in the header, (2) fire the view POST on page load via the existing `<script>` block.

- [ ] **Step 1: Add BlogStats import**

In `src/pages/blog/[slug].astro`, add the import after line 6 (after the `Icon` import):

```astro
import BlogStats from '../../components/BlogStats.tsx';
```

- [ ] **Step 2: Replace the time element in the post header**

Find this block (around line 37–38):

```astro
      <h1 class="text-3xl font-bold text-ink mb-3">{title}</h1>
      <time class="text-dim text-sm" datetime={publishDate.toISOString()}>{dateStr}</time>
```

Replace it with:

```astro
      <h1 class="text-3xl font-bold text-ink mb-3">{title}</h1>
      <div class="flex items-center gap-4 flex-wrap">
        <time class="text-dim text-sm" datetime={publishDate.toISOString()}>{dateStr}</time>
        <BlogStats slug={post.slug} interactive={true} client:load />
      </div>
```

- [ ] **Step 3: Fire view count on page load**

Inside the existing `<script>` block at the bottom of the file, add these lines at the very top of the script (before the `document.querySelectorAll` call):

```js
fetch('/.netlify/functions/view', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: document.location.pathname.replace('/blog/', '').replace(/\/$/, ''),
  }),
}).catch(() => {});
```

- [ ] **Step 4: Verify locally (netlify dev running)**

Open `http://localhost:8888/blog/first-week-at-kms-technology` (or any slug). Confirm:
- Stats row appears next to the date: `☆ 1 · 1 views`
- Clicking the star fills it to `★` and increments the count
- Clicking again unfills it back to `☆` and decrements
- Refreshing the page increments views by 1 each time

- [ ] **Step 5: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: show stats and star button on blog post page"
```

---

### Task 7: Add stats to the blog list

**Files:**
- Modify: `src/components/TagFilter.tsx`

Add a `statsMap` state. On mount, fetch all slugs in one bulk call. Render counts inside each card.

- [ ] **Step 1: Replace TagFilter.tsx with the updated version**

```tsx
import { useState, useEffect } from 'preact/hooks';

interface Post {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  tags: string[];
}

interface Stats {
  views: number;
  stars: number;
}

interface Props {
  posts: Post[];
  allTags: string[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function TagFilter({ posts, allTags }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [statsMap, setStatsMap] = useState<Record<string, Stats>>({});

  useEffect(() => {
    const slugs = posts.map((p) => p.slug).join(',');
    fetch(`/.netlify/functions/stats?slugs=${slugs}`)
      .then((r) => r.json())
      .then((data: Record<string, Stats>) => setStatsMap(data))
      .catch(() => {});
  }, []);

  const filtered = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  const pillClass = (selected: boolean) =>
    `text-xs font-mono px-3 py-1 rounded border transition-colors cursor-pointer ${
      selected
        ? 'border-accent text-accent bg-surface'
        : 'border-edge text-dim hover:border-ink hover:text-ink'
    }`;

  return (
    <div>
      {/* Tag filter pills */}
      <div class="flex flex-wrap gap-2 mb-8">
        <button class={pillClass(active === null)} onClick={() => setActive(null)}>
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            class={pillClass(active === tag)}
            onClick={() => setActive(active === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post list */}
      {filtered.length === 0 ? (
        <p class="text-dim text-sm">No posts with this tag yet.</p>
      ) : (
        <div class="space-y-3">
          {filtered.map((post) => {
            const s = statsMap[post.slug];
            return (
              <a key={post.slug} href={`/blog/${post.slug}`} class="group block">
                <article class="border border-edge rounded-lg p-5 bg-surface hover:border-accent transition-colors">
                  <div class="flex flex-wrap items-center gap-2 text-xs text-dim mb-2">
                    <time>{formatDate(post.publishDate)}</time>
                    {post.tags.slice(0, 4).map((t) => (
                      <span class="bg-canvas px-2 py-0.5 rounded font-mono border border-edge">{t}</span>
                    ))}
                    {s !== undefined && (
                      <span class="ml-auto font-mono">
                        ☆ {s.stars} · {s.views} views
                      </span>
                    )}
                  </div>
                  <h3 class="text-ink font-semibold group-hover:text-accent transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p class="text-dim text-sm leading-relaxed">{post.description}</p>
                </article>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 3: Verify locally (netlify dev running)**

Open `http://localhost:8888/blog`. Confirm:
- After a brief load, each card shows `☆ N · N views` aligned to the right of the tags row
- Tag filter still works (clicking a tag still filters cards)
- Counts show correctly (you can cross-check with the values you set in Tasks 3–4)

- [ ] **Step 4: Commit**

```bash
git add src/components/TagFilter.tsx
git commit -m "feat: show star and view counts on blog list cards"
```

---

### Task 8: Set up Upstash Redis and Netlify environment variables

This task is entirely manual configuration — no code changes.

- [ ] **Step 1: Create Upstash account and database**

1. Go to [console.upstash.com](https://console.upstash.com) and sign up (free)
2. Click **Create Database**
3. Name: `portfolio-blog`
4. Region: pick closest to your Netlify deployment (e.g. `us-east-1` for US East)
5. Type: **Regional** (free tier)
6. Click **Create**

- [ ] **Step 2: Copy credentials**

On the database detail page, scroll to the **REST API** section. Copy both:
- `UPSTASH_REDIS_REST_URL` (e.g. `https://your-db.upstash.io`)
- `UPSTASH_REDIS_REST_TOKEN` (long token string)

- [ ] **Step 3: Add env vars to Netlify dashboard**

1. Netlify dashboard → your site → **Site configuration** → **Environment variables**
2. Add `UPSTASH_REDIS_REST_URL` = the URL
3. Add `UPSTASH_REDIS_REST_TOKEN` = the token
4. Save

- [ ] **Step 4: Add env vars for local development**

Create `.env` in the project root (it is now in `.gitignore`):

```
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

- [ ] **Step 5: Redeploy and smoke-test on production**

Push any commit to trigger a Netlify deploy. After deploy completes, open your live blog post and check the browser Network tab:
- `POST /.netlify/functions/view` → 200
- `GET /.netlify/functions/stats?slug=...` → 200 with `{"views":N,"stars":N}`

Stars and view counts should now appear publicly on the live site.
