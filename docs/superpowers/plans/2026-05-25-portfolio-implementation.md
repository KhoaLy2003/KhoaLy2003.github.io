# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build khoaly2003.github.io — a multi-page personal portfolio and blog for Ly Ngoc Dang Khoa using Astro 5, Tailwind CSS, and Preact islands, deployed to GitHub Pages via GitHub Actions.

**Architecture:** Fully static site built with Astro 5 Content Collections. Blog posts and projects are markdown files committed to the repo. All pages are pre-rendered to HTML at build time. Two Preact islands add client-side interactivity: a tag filter on the blog index and copy-code buttons injected via an inline script on post pages.

**Tech Stack:** Astro 5.x · TypeScript · Tailwind CSS 3.x · @astrojs/tailwind · @astrojs/preact · Preact 10.x · GitHub Actions

---

### Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "khoaly2003-portfolio",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/preact": "^4.2.0",
    "@astrojs/tailwind": "^5.1.4",
    "astro": "^5.7.0",
    "preact": "^10.25.0",
    "tailwindcss": "^3.4.17"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://khoaly2003.github.io',
  integrations: [tailwind(), preact()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
```

- [ ] **Step 3: Create `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0d1117',
        surface: '#161b22',
        edge: '#30363d',
        ink: '#e6edf3',
        dim: '#8b949e',
        accent: '#58a6ff',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.superpowers/
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Verify Astro CLI is available**

Run: `npx astro --version`

Expected: prints `astro v5.x.x`

---

### Task 2: Content Schemas & Seed Data

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/building-otaku-community.md`
- Create: `src/content/blog/why-i-love-spring-boot.md`
- Create: `src/content/blog/my-first-post.md`
- Create: `src/content/projects/otaku-community.md`
- Create: `src/content/projects/tps-financial-system.md`

- [ ] **Step 1: Create `src/content/config.ts`**

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    github: z.string().url(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
```

- [ ] **Step 2: Create `src/content/blog/building-otaku-community.md`**

```markdown
---
title: "What I learned building Otaku Community"
description: "Lessons from designing a full-stack platform for anime fans — from fan-out on write to async media uploads."
publishDate: 2025-12-20
tags: ["java", "spring-boot", "architecture", "personal"]
draft: false
---

Building Otaku Community was the most ambitious personal project I've taken on...

## The fan-out problem

When a user posts something, who sees it and when? I went with a "fan-out on write" approach — when a post is created, a background job pushes it to each follower's feed immediately...

## Async media uploads

Uploading images and videos synchronously blocks the request thread and leaves the user staring at a spinner. I moved this into an async batch processing system with real-time job tracking via WebSocket...

## What I'd do differently

Looking back, I over-engineered the notification system early on. Start with the simplest thing that works.
```

- [ ] **Step 3: Create `src/content/blog/why-i-love-spring-boot.md`**

```markdown
---
title: "Why I still love Spring Boot in 2025"
description: "Spring Boot gets criticized for being heavy. Here's why I think that criticism misses the point."
publishDate: 2025-09-10
tags: ["java", "spring-boot", "backend"]
draft: false
---

Every few months someone writes a post about how Spring Boot is bloated and you should use Micronaut, Quarkus, or just write plain Java...

## Convention over configuration done right

The thing Spring Boot gets right is that sensible defaults are a feature, not a bug...

## The ecosystem matters

No framework exists in isolation. The Spring ecosystem — Security, Data, WebSocket, Batch — is mature, well-documented, and battle-tested in production...
```

- [ ] **Step 4: Create `src/content/blog/my-first-post.md`**

```markdown
---
title: "Hello, internet"
description: "Why I'm starting a personal site and what I plan to write about."
publishDate: 2026-05-25
tags: ["personal"]
draft: false
---

I've been meaning to build a personal site for a long time. Not just a portfolio — a place where I can write things down...

## What this place is

A mix. Technical posts about backend development and Java. Personal posts about life, things I'm learning, and whatever I'm thinking about.

## What to expect

Honest writing. No SEO games. Posts when I have something worth saying.
```

- [ ] **Step 5: Create `src/content/projects/otaku-community.md`**

```markdown
---
title: "Otaku Community Platform"
description: "A full-stack community platform connecting anime/manga fans, translators, and content creators."
tech: ["java", "spring-boot", "spring-security", "postgresql", "redis", "websocket", "react", "typescript"]
github: "https://github.com/KhoaLy2003/otaku-community"
demo: "https://otaku-community.vercel.app"
featured: true
---

Designed and built a full-stack platform for the anime and manga community. Features include a news feed with cursor-based pagination, real-time notifications via WebSocket, and an async media upload pipeline with job tracking.
```

- [ ] **Step 6: Create `src/content/projects/tps-financial-system.md`**

```markdown
---
title: "Financial Management System"
description: "Backend services for a financial platform — project management, real-time dashboards, and multi-department approval workflows."
tech: ["java", "spring-boot", "postgresql", "microservices", "websocket", "liquibase", "aws-s3"]
github: "https://github.com/KhoaLy2003"
featured: true
---

Backend contributions at TPS Software Solution: built a project management feature consolidating financial transaction data, developed real-time dashboard streaming via WebSocket, and optimized SQL queries reducing page load time by up to 50%.
```

- [ ] **Step 7: Type-check the schema**

Run: `npx astro check`

Expected: no TypeScript errors.

---

### Task 3: Base Layout, Header, Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
---
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/uses', label: 'Uses' },
  { href: '/about', label: 'About' },
];
const { pathname } = Astro.url;
---
<header class="border-b border-edge sticky top-0 bg-canvas z-10">
  <nav class="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
    <a href="/" class="font-mono text-sm text-ink font-semibold hover:text-accent transition-colors">
      khoa.ly
    </a>
    <ul class="flex gap-6 list-none m-0 p-0">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class={`text-sm transition-colors ${
              pathname === href || (href !== '/' && pathname.startsWith(href))
                ? 'text-accent'
                : 'text-dim hover:text-ink'
            }`}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="border-t border-edge mt-20 py-8">
  <div class="max-w-4xl mx-auto px-6 flex items-center justify-between text-sm text-dim">
    <span>© {year} Ly Ngoc Dang Khoa</span>
    <div class="flex gap-5">
      <a
        href="https://github.com/KhoaLy2003"
        class="hover:text-accent transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >GitHub</a>
      <a
        href="https://www.linkedin.com/in/khoaly2003"
        class="hover:text-accent transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >LinkedIn</a>
      <a
        href="mailto:khoaly090141@gmail.com"
        class="hover:text-accent transition-colors"
      >Email</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Create `src/layouts/BaseLayout.astro`**

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = 'Ly Ngoc Dang Khoa — Backend Developer based in Ho Chi Minh City.',
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title === 'Home' ? 'Khoa Ly' : `${title} — Khoa Ly`}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <style is:global>
      body {
        background-color: #0d1117;
        color: #e6edf3;
      }
      /* Blog post prose styles */
      .prose { line-height: 1.8; }
      .prose h2 { font-size: 1.5rem; font-weight: 700; color: #e6edf3; margin: 2.5rem 0 1rem; }
      .prose h3 { font-size: 1.25rem; font-weight: 600; color: #e6edf3; margin: 2rem 0 0.75rem; }
      .prose p { margin-bottom: 1.25rem; color: #e6edf3; }
      .prose a { color: #58a6ff; text-decoration: underline; }
      .prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
      .prose ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
      .prose li { margin-bottom: 0.25rem; color: #e6edf3; }
      .prose strong { font-weight: 600; color: #e6edf3; }
      .prose hr { border-color: #30363d; margin: 2rem 0; }
      .prose blockquote {
        border-left: 2px solid #30363d;
        padding-left: 1rem;
        color: #8b949e;
        font-style: italic;
        margin: 1.5rem 0;
      }
      .prose code:not(pre code) {
        font-family: ui-monospace, monospace;
        font-size: 0.875em;
        background: #161b22;
        padding: 0.125rem 0.375rem;
        border-radius: 4px;
        color: #8b949e;
        border: 1px solid #30363d;
      }
      .prose pre {
        background: #161b22 !important;
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
        overflow-x: auto;
      }
      .prose pre code { background: transparent !important; padding: 0; border: none; font-size: 0.875em; }
    </style>
  </head>
  <body class="min-h-screen flex flex-col font-sans">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Create `public/favicon.svg`**

Astro serves files in `public/` at the root. The layout links to `/favicon.svg`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0d1117"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
    font-family="monospace" font-size="18" font-weight="700" fill="#58a6ff">K</text>
</svg>
```

- [ ] **Step 6: Create a minimal placeholder home page to verify the layout renders**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <p class="p-8 text-ink">Layout works.</p>
</BaseLayout>
```

- [ ] **Step 7: Start dev server and verify layout**

Run: `npm run dev`

Open http://localhost:4321 in browser. Verify:
- Dark background (#0d1117)
- Header with nav links visible
- Footer with GitHub / LinkedIn / Email links visible
- No console errors

---

### Task 4: Home Page

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/PostCard.astro` (stub — full version in Task 7)
- Create: `src/components/ProjectCard.astro` (stub — full version in Task 6)

The home page queries the three most recent published blog posts and up to two featured projects. PostCard and ProjectCard are stubbed here just enough to unblock the home page; they get their final implementation in Tasks 6 and 7.

- [ ] **Step 1: Create stub `src/components/PostCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { post: CollectionEntry<'blog'>; }
const { post } = Astro.props;
---
<a href={`/blog/${post.slug}`} class="block border border-edge rounded-lg p-5 bg-surface hover:border-accent transition-colors">
  <p class="text-dim text-xs mb-1">{post.data.publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  <h3 class="text-ink font-semibold">{post.data.title}</h3>
  <p class="text-dim text-sm mt-1">{post.data.description}</p>
</a>
```

- [ ] **Step 2: Create stub `src/components/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { project: CollectionEntry<'projects'>; }
const { project } = Astro.props;
---
<article class="border border-edge rounded-lg p-5 bg-surface">
  <h3 class="text-ink font-semibold mb-1">{project.data.title}</h3>
  <p class="text-dim text-sm">{project.data.description}</p>
</article>
```

- [ ] **Step 3: Replace `src/pages/index.astro` with full home page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
  .slice(0, 3);

const featuredProjects = (await getCollection('projects'))
  .filter((p) => p.data.featured)
  .slice(0, 2);
---
<BaseLayout title="Home">
  <!-- Hero -->
  <section class="max-w-4xl mx-auto px-6 pt-20 pb-16">
    <p class="font-mono text-dim text-sm mb-3">Hi, I'm</p>
    <h1 class="text-4xl sm:text-5xl font-bold text-ink mb-3">Ly Ngoc Dang Khoa</h1>
    <p class="text-xl text-dim mb-6">Backend Developer · Ho Chi Minh City</p>
    <p class="text-ink max-w-xl leading-relaxed mb-8">
      I build reliable backend systems with Java and Spring Boot. I also write about
      what I'm learning and things I care about.
    </p>
    <div class="flex flex-wrap gap-5 text-sm">
      <a
        href="https://github.com/KhoaLy2003"
        class="text-dim hover:text-accent transition-colors"
        target="_blank" rel="noopener noreferrer"
      >GitHub ↗</a>
      <a
        href="https://www.linkedin.com/in/khoaly2003"
        class="text-dim hover:text-accent transition-colors"
        target="_blank" rel="noopener noreferrer"
      >LinkedIn ↗</a>
      <a href="/blog" class="text-dim hover:text-ink transition-colors">Blog →</a>
      <a href="/projects" class="text-dim hover:text-ink transition-colors">Projects →</a>
    </div>
  </section>

  <!-- Recent posts -->
  {posts.length > 0 && (
    <section class="max-w-4xl mx-auto px-6 pb-16">
      <h2 class="text-xs font-mono text-dim uppercase tracking-widest mb-6">Recent Posts</h2>
      <div class="space-y-3">
        {posts.map((post) => <PostCard post={post} />)}
      </div>
      <a href="/blog" class="inline-block mt-6 text-sm text-accent hover:underline">
        All posts →
      </a>
    </section>
  )}

  <!-- Featured projects -->
  {featuredProjects.length > 0 && (
    <section class="max-w-4xl mx-auto px-6 pb-24">
      <h2 class="text-xs font-mono text-dim uppercase tracking-widest mb-6">Featured Projects</h2>
      <div class="grid sm:grid-cols-2 gap-4">
        {featuredProjects.map((project) => <ProjectCard project={project} />)}
      </div>
      <a href="/projects" class="inline-block mt-6 text-sm text-accent hover:underline">
        All projects →
      </a>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 4: Verify home page in browser**

With `npm run dev` running, open http://localhost:4321.

Verify:
- Hero section shows name and tagline
- 3 recent blog post cards appear
- 2 featured project cards appear
- All links in nav highlight "Home" (active state)
- No console errors

---

### Task 5: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="About"
  description="About Ly Ngoc Dang Khoa — Backend Developer based in Ho Chi Minh City."
>
  <div class="max-w-3xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-ink mb-6">About</h1>

    <p class="text-ink leading-relaxed mb-14 max-w-2xl">
      Software Engineer with hands-on experience developing backend systems using modern
      frameworks. Strong foundation in backend development, system design, and database
      optimization, with a focus on building reliable and maintainable applications.
    </p>

    <!-- Experience -->
    <section class="mb-14">
      <h2 class="text-xs font-mono text-dim uppercase tracking-widest mb-8">Experience</h2>
      <div class="space-y-10">

        <div>
          <div class="flex flex-wrap justify-between items-start gap-2 mb-1">
            <h3 class="text-ink font-semibold">TPS Software Solution</h3>
            <span class="text-dim text-sm font-mono">Mar 2025 – Present</span>
          </div>
          <p class="text-dim text-sm mb-3">Backend Developer</p>
          <ul class="space-y-1.5 text-sm text-ink list-disc pl-4 marker:text-dim">
            <li>Developed backend services for financial systems using Java and Spring Boot in a microservices architecture.</li>
            <li>Refactored business logic and optimized SQL queries, reducing page load time from 10–15s to 5–8s per 100 records (up to 50% improvement).</li>
            <li>Built real-time dashboard streaming using WebSocket and database functions.</li>
            <li>Contributed to multi-department budget approval workflows.</li>
            <li>Maintained over 80% code coverage with JUnit and Mockito.</li>
          </ul>
          <p class="text-xs font-mono text-dim mt-4">
            Java · Spring Boot · PostgreSQL · Microservices · Liquibase · WebSocket · AWS S3
          </p>
        </div>

        <div>
          <div class="flex flex-wrap justify-between items-start gap-2 mb-1">
            <h3 class="text-ink font-semibold">FPT Software</h3>
            <span class="text-dim text-sm font-mono">Sep 2023 – Dec 2023</span>
          </div>
          <p class="text-dim text-sm mb-3">Intern Backend Developer</p>
          <ul class="space-y-1.5 text-sm text-ink list-disc pl-4 marker:text-dim">
            <li>Developed and improved programming modules using Java and Spring Boot.</li>
            <li>Implemented unit tests to ensure code quality and reliability.</li>
          </ul>
        </div>

      </div>
    </section>

    <!-- Skills -->
    <section class="mb-14">
      <h2 class="text-xs font-mono text-dim uppercase tracking-widest mb-8">Skills</h2>
      <div class="space-y-4 text-sm">
        {[
          { label: 'Backend', value: 'Java · Spring Boot · Spring Security · RESTful API · Microservices · JPA/Hibernate · WebSocket · JWT' },
          { label: 'Databases', value: 'PostgreSQL · MySQL · Redis' },
          { label: 'Testing', value: 'JUnit · Mockito' },
          { label: 'Tools', value: 'Git · GitLab · Docker · IntelliJ IDEA · Postman · DBeaver · Jira' },
        ].map(({ label, value }) => (
          <div class="flex gap-6">
            <span class="text-dim w-24 shrink-0">{label}</span>
            <span class="text-ink font-mono text-xs leading-relaxed">{value}</span>
          </div>
        ))}
      </div>
    </section>

    <!-- Education -->
    <section class="mb-14">
      <h2 class="text-xs font-mono text-dim uppercase tracking-widest mb-8">Education</h2>
      <div class="flex flex-wrap justify-between items-start gap-2">
        <div>
          <h3 class="text-ink font-semibold">FPT University HCM</h3>
          <p class="text-dim text-sm">Bachelor of Software Engineering · GPA 8.4/10</p>
        </div>
        <span class="text-dim text-sm font-mono">Jan 2022 – Jan 2025</span>
      </div>
    </section>

    <!-- Certifications -->
    <section>
      <h2 class="text-xs font-mono text-dim uppercase tracking-widest mb-8">Certifications</h2>
      <ul class="space-y-2 text-sm">
        <li class="flex gap-4">
          <span class="text-dim w-16 shrink-0">TOEIC</span>
          <span class="text-ink">845/990 (2025)</span>
        </li>
        <li class="flex gap-4">
          <span class="text-dim w-16 shrink-0">JLPT</span>
          <span class="text-ink">N3 (2025) · N4 (2024)</span>
        </li>
        <li class="flex gap-4">
          <span class="text-dim w-16 shrink-0">IELTS</span>
          <span class="text-ink">6.0 (2020)</span>
        </li>
      </ul>
    </section>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify About page**

Open http://localhost:4321/about.

Verify:
- All experience, skills, education, and certification sections render
- "About" nav link is highlighted (active)
- No layout breaks on a narrower browser window

---

### Task 6: Projects Page & ProjectCard

**Files:**
- Modify: `src/components/ProjectCard.astro` (replace stub)
- Create: `src/pages/projects.astro`

- [ ] **Step 1: Replace stub `src/components/ProjectCard.astro` with full implementation**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  project: CollectionEntry<'projects'>;
}
const { project } = Astro.props;
const { title, description, tech, github, demo } = project.data;
---
<article class="border border-edge rounded-lg p-5 bg-surface flex flex-col gap-4 hover:border-accent transition-colors">
  <div>
    <h3 class="text-ink font-semibold mb-1.5">{title}</h3>
    <p class="text-dim text-sm leading-relaxed">{description}</p>
  </div>
  <div class="flex flex-wrap gap-1.5">
    {tech.map((t) => (
      <span class="text-xs font-mono bg-canvas text-dim px-2 py-0.5 rounded border border-edge">
        {t}
      </span>
    ))}
  </div>
  <div class="flex gap-4 mt-auto pt-1 text-sm">
    <a
      href={github}
      class="text-accent hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >GitHub ↗</a>
    {demo && (
      <a
        href={demo}
        class="text-accent hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >Demo ↗</a>
    )}
  </div>
</article>
```

- [ ] **Step 2: Create `src/pages/projects.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
---
<BaseLayout title="Projects" description="Projects built by Ly Ngoc Dang Khoa.">
  <div class="max-w-4xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-ink mb-2">Projects</h1>
    <p class="text-dim mb-10">Things I've built.</p>
    <div class="grid sm:grid-cols-2 gap-4">
      {projects.map((project) => <ProjectCard project={project} />)}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verify Projects page**

Open http://localhost:4321/projects.

Verify:
- Both project cards render with title, description, tech tags, and GitHub link
- Otaku Community shows both GitHub and Demo links
- Tech tags display in monospace
- "Projects" nav link is highlighted

---

### Task 7: Blog Index, PostCard & TagFilter

**Files:**
- Modify: `src/components/PostCard.astro` (replace stub)
- Create: `src/components/TagFilter.tsx`
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Replace stub `src/components/PostCard.astro` with full implementation**

This component is used by the home page (no tag interaction needed) and is also the card template re-implemented inside TagFilter for the blog index.

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  post: CollectionEntry<'blog'>;
}
const { post } = Astro.props;
const { title, description, publishDate, tags } = post.data;
const dateStr = publishDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---
<a href={`/blog/${post.slug}`} class="group block">
  <article class="border border-edge rounded-lg p-5 bg-surface hover:border-accent transition-colors">
    <div class="flex flex-wrap items-center gap-2 text-xs text-dim mb-2">
      <time datetime={publishDate.toISOString()}>{dateStr}</time>
      {tags.slice(0, 4).map((tag) => (
        <span class="bg-canvas px-2 py-0.5 rounded font-mono border border-edge">{tag}</span>
      ))}
    </div>
    <h3 class="text-ink font-semibold group-hover:text-accent transition-colors mb-1">
      {title}
    </h3>
    <p class="text-dim text-sm leading-relaxed">{description}</p>
  </article>
</a>
```

- [ ] **Step 2: Create `src/components/TagFilter.tsx`**

This Preact island receives serialized post data and all tags as props, manages the active tag in local state, and renders the filtered post list.

```tsx
import { useState } from 'preact/hooks';

interface Post {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  tags: string[];
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
          {filtered.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} class="group block">
              <article class="border border-edge rounded-lg p-5 bg-surface hover:border-accent transition-colors">
                <div class="flex flex-wrap items-center gap-2 text-xs text-dim mb-2">
                  <time>{formatDate(post.publishDate)}</time>
                  {post.tags.slice(0, 4).map((t) => (
                    <span class="bg-canvas px-2 py-0.5 rounded font-mono border border-edge">{t}</span>
                  ))}
                </div>
                <h3 class="text-ink font-semibold group-hover:text-accent transition-colors mb-1">
                  {post.title}
                </h3>
                <p class="text-dim text-sm leading-relaxed">{post.description}</p>
              </article>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/pages/blog/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import TagFilter from '../../components/TagFilter.tsx';
import { getCollection } from 'astro:content';

const allPosts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
);

const allTags = [...new Set(allPosts.flatMap((p) => p.data.tags))].sort();

const postsForClient = allPosts.map((p) => ({
  slug: p.slug,
  title: p.data.title,
  description: p.data.description,
  publishDate: p.data.publishDate.toISOString(),
  tags: p.data.tags,
}));
---
<BaseLayout
  title="Blog"
  description="Writing about backend development, Java, and things I care about."
>
  <div class="max-w-4xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-ink mb-2">Blog</h1>
    <p class="text-dim mb-10">Thoughts on backend development, Java, and life.</p>
    <TagFilter posts={postsForClient} allTags={allTags} client:load />
  </div>
</BaseLayout>
```

- [ ] **Step 4: Verify Blog index with tag filtering**

Open http://localhost:4321/blog.

Verify:
- All 3 seed posts appear in the list
- Tag pills render: `All`, `java`, `spring-boot`, `architecture`, `backend`, `personal`
- Clicking a tag filters the list (e.g. clicking `personal` shows only Hello World and Otaku posts)
- Clicking the active tag again deselects it (returns to "All")
- Clicking "All" shows all posts
- No page reload on filter

---

### Task 8: Blog Post Page & Copy Code

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create `src/pages/blog/[slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
const { title, description, publishDate, tags } = post.data;
const dateStr = publishDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---
<BaseLayout title={title} description={description}>
  <article class="max-w-3xl mx-auto px-6 py-16">
    <!-- Post header -->
    <header class="mb-10">
      <div class="flex flex-wrap gap-2 mb-5">
        {tags.map((tag) => (
          <span class="text-xs font-mono bg-surface text-dim px-2 py-0.5 rounded border border-edge">
            {tag}
          </span>
        ))}
      </div>
      <h1 class="text-3xl font-bold text-ink mb-3">{title}</h1>
      <time class="text-dim text-sm" datetime={publishDate.toISOString()}>{dateStr}</time>
    </header>

    <!-- Post content -->
    <div class="prose">
      <Content />
    </div>

    <!-- Back link -->
    <div class="mt-16 pt-8 border-t border-edge">
      <a href="/blog" class="text-sm text-accent hover:underline">← All posts</a>
    </div>
  </article>
</BaseLayout>

<script>
  // Inject copy buttons into all code blocks after the DOM is ready
  document.querySelectorAll('pre').forEach((pre) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;';
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.style.cssText = [
      'position:absolute;top:10px;right:10px;',
      'padding:3px 10px;font-size:11px;font-family:ui-monospace,monospace;',
      'background:#21262d;color:#8b949e;border:1px solid #30363d;',
      'border-radius:6px;cursor:pointer;transition:color 0.15s,border-color 0.15s;',
    ].join('');
    wrapper.appendChild(btn);

    btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#58a6ff'; });
    btn.addEventListener('mouseleave', () => {
      if (btn.textContent === 'Copy') btn.style.borderColor = '#30363d';
    });

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent ?? '';
      await navigator.clipboard.writeText(code);
      btn.textContent = 'Copied!';
      btn.style.color = '#58a6ff';
      btn.style.borderColor = '#58a6ff';
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.style.color = '#8b949e';
        btn.style.borderColor = '#30363d';
      }, 2000);
    });
  });
</script>
```

- [ ] **Step 2: Verify a blog post renders**

Open http://localhost:4321/blog/building-otaku-community.

Verify:
- Post title, date, and tags render in the header
- Post body markdown is rendered (headings, paragraphs)
- Code blocks (if any) have a "Copy" button in the top-right corner
- Clicking "Copy" changes text to "Copied!" then resets after 2 seconds
- "← All posts" link at the bottom returns to /blog

---

### Task 9: Uses Page

**Files:**
- Create: `src/pages/uses.astro`

- [ ] **Step 1: Create `src/pages/uses.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const sections = [
  {
    title: 'Editor & IDE',
    items: [
      { name: 'IntelliJ IDEA', desc: 'Primary IDE for Java and Spring Boot. The inspections and refactoring tools are unmatched.' },
      { name: 'Visual Studio Code', desc: 'For frontend work, markdown editing, and quick file edits.' },
    ],
  },
  {
    title: 'Terminal & Version Control',
    items: [
      { name: 'Git', desc: 'Version control for everything. GitLab at work, GitHub for personal projects.' },
      { name: 'Windows Terminal', desc: 'PowerShell and bash side by side.' },
    ],
  },
  {
    title: 'Tools & Software',
    items: [
      { name: 'Docker', desc: 'Local development and containerizing services. Keeps my machine clean.' },
      { name: 'Postman', desc: 'API testing and manual endpoint exploration.' },
      { name: 'DBeaver', desc: 'Database management and SQL queries across PostgreSQL and MySQL.' },
      { name: 'Jira', desc: 'Sprint planning and task tracking at work.' },
    ],
  },
  {
    title: 'Miscellaneous',
    items: [
      { name: 'Notion', desc: 'Notes, study plans, and personal project tracking.' },
    ],
  },
];
---
<BaseLayout title="Uses" description="The tools, software, and gear Khoa uses day to day.">
  <div class="max-w-3xl mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-ink mb-2">Uses</h1>
    <p class="text-dim mb-14">Tools and software I use day to day.</p>

    <div class="space-y-14">
      {sections.map(({ title, items }) => (
        <section>
          <h2 class="text-xs font-mono text-dim uppercase tracking-widest mb-6">{title}</h2>
          <ul class="space-y-5">
            {items.map(({ name, desc }) => (
              <li>
                <p class="text-ink font-medium mb-0.5">{name}</p>
                <p class="text-dim text-sm">{desc}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>

    <p class="text-dim text-sm italic mt-14">This page is a living document — I'll update it as my setup changes.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify Uses page**

Open http://localhost:4321/uses.

Verify:
- All four sections (Editor & IDE, Terminal & Version Control, Tools & Software, Miscellaneous) render
- "Uses" nav link is highlighted
- Page looks clean with proper spacing

---

### Task 10: GitHub Actions Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify the production build completes locally**

Run: `npm run build`

Expected: `dist/` directory created, output shows pages built. No TypeScript or Astro errors.

Run: `npm run preview`

Open http://localhost:4321. Verify the built site works identically to dev mode.

- [ ] **Step 3: Enable GitHub Pages in repo settings (manual step)**

In the GitHub repo settings:
1. Go to Settings → Pages
2. Under "Build and deployment", set Source to **GitHub Actions**
3. Save

- [ ] **Step 4: Note on first deploy**

After pushing to `main`, the Actions tab will show the workflow running. The first deploy takes ~2 minutes. Subsequent deploys take ~1 minute. The site will be live at https://khoaly2003.github.io.

---

## Verification Checklist

After all tasks complete, verify each route:

| URL | Expected |
|---|---|
| `/` | Hero + 3 posts + 2 projects |
| `/about` | Experience, Skills, Education, Certifications |
| `/projects` | Project cards with tech tags and links |
| `/blog` | Post list with working tag filter |
| `/blog/building-otaku-community` | Full post with copy buttons on code blocks |
| `/uses` | 4 sections of tools |

Run `npm run build` — zero errors is the pass condition.
