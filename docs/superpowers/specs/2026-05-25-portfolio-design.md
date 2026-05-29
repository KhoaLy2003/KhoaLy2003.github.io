# Portfolio Website Design

**Date:** 2026-05-25
**Owner:** Ly Ngoc Dang Khoa (khoaly2003.github.io)

## Overview

A personal multi-page portfolio site built with Astro 5.x. The site serves dual purpose: a professional portfolio (projects, skills, experience) and a personal corner of the internet (blog mixing tech writing and personal posts). Dark minimal aesthetic inspired by GitHub's dark theme. Deployed as a fully static site to GitHub Pages.

## Tech Stack

- **Framework:** Astro 5.x + TypeScript
- **Styling:** Tailwind CSS
- **Interactive islands:** Preact (`client:load`)
- **Content:** Astro Content Collections (markdown files in the repo)
- **Deployment:** GitHub Actions → `gh-pages` branch → `khoaly2003.github.io`

## Pages & Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero (name, role tagline, GitHub/LinkedIn links, CTA to blog and projects), 3 most recent blog posts, 2 featured projects |
| `/about` | About | Personal story, skills, work experience, education, certifications |
| `/projects` | Projects | Full project showcase grid with tech stack tags |
| `/blog` | Blog index | Post list with interactive tag filter |
| `/blog/[slug]` | Blog post | Full post with syntax highlighting and copy-code buttons |
| `/uses` | Uses | Manually maintained list of tools, editor, hardware, software |

No dedicated Contact page — GitHub, LinkedIn, and email are surfaced in the footer on every page.

## Visual Design

**Palette (GitHub dark inspired):**

| Token | Value | Use |
|---|---|---|
| Background | `#0d1117` | Page canvas |
| Surface | `#161b22` | Cards, code blocks |
| Border | `#30363d` | Card borders, dividers |
| Text primary | `#e6edf3` | Headings, body |
| Text muted | `#8b949e` | Dates, tags, captions |
| Accent | `#58a6ff` | Links, active states, highlights |

**Typography:** System font stack (no custom fonts — fits the minimal, code-adjacent aesthetic).

**Spacing:** Tailwind defaults (4px base unit). Generous whitespace between sections.

## Content Model

### Blog Posts — `src/content/blog/*.md`

```
---
title: string
description: string          # used in post card preview
publishDate: Date
tags: string[]               # free-form, e.g. ["java", "spring-boot", "personal"]
draft: boolean               # draft: true hides post from build output
---
```

Posts are plain markdown. No MDX required. Tags are free-form strings — no predefined taxonomy.

### Projects — `src/content/projects/*.md`

```
---
title: string
description: string
tech: string[]               # e.g. ["java", "spring-boot", "postgresql"]
github: string               # GitHub repo URL
demo: string | undefined     # live demo URL, optional
featured: boolean            # if true, shown on home page (max 2)
---
```

### Uses Page

A static Astro page (`src/pages/uses.astro`), not a content collection. Manually edited. Organized into sections: Editor & IDE, Terminal, Hardware, Software, and Miscellaneous.

## Component Architecture

### Astro Components (zero client-side JS)

- `BaseLayout.astro` — `<html>`, `<head>` meta, fonts, global styles, slots for page content
- `Header.astro` — site nav with active link highlight; links to Home, Blog, Projects, Uses, About
- `Footer.astro` — name, GitHub, LinkedIn, email links; copyright
- `PostCard.astro` — blog post preview: title, publish date, tags, description excerpt
- `ProjectCard.astro` — project card: title, description, tech tag list, GitHub and demo links

### Preact Islands (selective hydration)

- `TagFilter.tsx` (`client:load`) — renders clickable tag pills on `/blog`. Filters the post list client-side by selected tag. State: one active tag or "All". No page reload.
- `CopyCodeButton.tsx` (`client:load`) — injected into every `<pre><code>` block on blog post pages. Copies block content to clipboard, shows brief "Copied!" feedback.

### File Tree

```
src/
  components/
    Header.astro
    Footer.astro
    PostCard.astro
    ProjectCard.astro
    TagFilter.tsx
    CopyCodeButton.tsx
  content/
    config.ts
    blog/
    projects/
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    about.astro
    uses.astro
    projects.astro
    blog/
      index.astro
      [slug].astro
astro.config.mjs
tailwind.config.mjs
tsconfig.json
.github/
  workflows/
    deploy.yml
```

## Deployment

**GitHub Actions workflow** (`.github/workflows/deploy.yml`):
1. Trigger: push to `main`
2. Install deps (`npm ci`)
3. Build (`astro build`)
4. Deploy `dist/` to `gh-pages` branch via `actions/deploy-pages`

Site is live at `khoaly2003.github.io` within ~1 minute of pushing to `main`.

**No environment variables, no secrets, no external services.** The entire site is reproducible from the git repo alone.

## Local Dev Workflow

```bash
npm run dev      # start dev server at http://localhost:4321
npm run build    # production build → dist/
npm run preview  # serve dist/ locally to verify build
```

**Writing a blog post:**
1. Create `src/content/blog/post-slug.md` with frontmatter
2. Use `draft: true` while writing
3. Set `draft: false` when ready to publish
4. Push to `main` — CI builds and deploys automatically

## Out of Scope

- Dark/light mode toggle (always dark)
- Search beyond tag filtering
- Comments system
- Analytics
- CMS or admin interface
- RSS feed (can be added later as Astro has a built-in integration)
