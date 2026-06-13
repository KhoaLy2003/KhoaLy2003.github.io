# Rich Blog Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Astro blog from text-only Markdown to MDX with three globally-injected components — Callout, Figure, and Icon — plus styled prose images.

**Architecture:** Enable `@astrojs/mdx` so blog posts can use JSX components without per-file imports. Three components live in `src/components/blog/` and are injected via `<Content components={{...}} />` in the blog slug page. `astro-icon` provides inline SVG icons from Iconify; `@iconify-json/logos` supplies tech logos.

**Tech Stack:** Astro 5, `@astrojs/mdx`, `astro-icon`, `@iconify-json/logos`, Tailwind CSS (existing)

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `astro.config.mjs` | Add `mdx()` and `icon()` integrations |
| Create | `src/components/blog/Callout.astro` | Styled callout box, 6 types |
| Create | `src/components/blog/Figure.astro` | Image with optional caption |
| Create | `src/components/blog/Icon.astro` | Thin wrapper around astro-icon |
| Modify | `src/pages/blog/[slug].astro` | Import + inject components into MDX |
| Modify | `src/layouts/BaseLayout.astro` | Add `.prose img`, `figure`, `figcaption` styles |
| Rename | `src/content/blog/*.md` → `*.mdx` | Enable MDX in all 3 existing posts |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install MDX integration and icon packages**

```bash
npm install @astrojs/mdx astro-icon @iconify-json/logos
```

Expected output: packages added to `node_modules`, `package.json` dependencies updated.

- [ ] **Step 2: Verify packages installed**

```bash
npm ls @astrojs/mdx astro-icon @iconify-json/logos
```

Expected: version numbers printed for all three, no `UNMET DEPENDENCY` errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @astrojs/mdx, astro-icon, @iconify-json/logos"
```

---

## Task 2: Configure MDX and astro-icon integrations

**Files:**
- Modify: `astro.config.mjs`

Current content of `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://khoaly2003.github.io',
  integrations: [tailwind(), preact()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: { ... },
});
```

- [ ] **Step 1: Update `astro.config.mjs`**

Replace the file with:
```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://khoaly2003.github.io',
  integrations: [tailwind(), preact(), mdx(), icon()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: 'astro-preact-opts-shim',
            setup(build) {
              build.onResolve({ filter: /^astro:preact:opts$/ }, () => ({
                path: 'astro:preact:opts',
                namespace: 'astro-preact-opts',
              }));
              build.onLoad({ filter: /.*/, namespace: 'astro-preact-opts' }, () => ({
                contents: 'export default { include: undefined, exclude: undefined };',
                loader: 'js',
              }));
            },
          },
        ],
      },
    },
  },
});
```

- [ ] **Step 2: Verify config compiles**

```bash
npm run check
```

Expected: no TypeScript or Astro config errors.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: add MDX and astro-icon integrations"
```

---

## Task 3: Create Callout component

**Files:**
- Create: `src/components/blog/Callout.astro`

- [ ] **Step 1: Create `src/components/blog/Callout.astro`**

```astro
---
interface Props {
  type: 'tip' | 'warning' | 'info' | 'note' | 'update' | 'tldr';
}

const { type } = Astro.props;

const config = {
  tip:     { emoji: '💡', label: 'Tip',     color: '#58a6ff' },
  warning: { emoji: '⚠️',  label: 'Warning', color: '#d29922' },
  info:    { emoji: 'ℹ️',  label: 'Info',    color: '#8b949e' },
  note:    { emoji: '📝', label: 'Note',    color: '#bc8cff' },
  update:  { emoji: '🔄', label: 'Update',  color: '#3fb950' },
  tldr:    { emoji: '⚡', label: 'TL;DR',   color: '#f0883e' },
};

const { emoji, label, color } = config[type];
---

<div class="callout" style={`--callout-color: ${color};`}>
  <div class="callout-header">
    <span>{emoji}</span>
    <strong>{label}</strong>
  </div>
  <div class="callout-body">
    <slot />
  </div>
</div>

<style>
  .callout {
    background: var(--color-surface);
    border-left: 3px solid var(--callout-color);
    border-radius: 0 6px 6px 0;
    padding: 0.75rem 1rem;
    margin: 1.5rem 0;
  }
  .callout-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
  }
  .callout-header strong {
    color: var(--callout-color);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .callout-body {
    color: var(--color-ink);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .callout-body :global(p) {
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/Callout.astro
git commit -m "feat: add Callout component with 6 types"
```

---

## Task 4: Create Figure component

**Files:**
- Create: `src/components/blog/Figure.astro`

- [ ] **Step 1: Create `src/components/blog/Figure.astro`**

```astro
---
interface Props {
  src: string;
  alt: string;
  caption?: string;
}

const { src, alt, caption } = Astro.props;
---

<figure>
  <img src={src} alt={alt} />
  {caption && <figcaption>{caption}</figcaption>}
</figure>
```

Note: the `img` and `figcaption` styles are applied globally by `.prose img` and `.prose figcaption` in `BaseLayout.astro` (added in Task 6).

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/Figure.astro
git commit -m "feat: add Figure component with optional caption"
```

---

## Task 5: Create Icon component

**Files:**
- Create: `src/components/blog/Icon.astro`

- [ ] **Step 1: Create `src/components/blog/Icon.astro`**

```astro
---
import { Icon as AstroIcon } from 'astro-icon/components';

interface Props {
  name: string;
  size?: string;
}

const { name, size = '1em' } = Astro.props;
---

<AstroIcon
  name={name}
  style={`width: ${size}; height: ${size}; vertical-align: middle; display: inline-block;`}
/>
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/Icon.astro
git commit -m "feat: add Icon component wrapping astro-icon"
```

---

## Task 6: Inject components into blog slug page

**Files:**
- Modify: `src/pages/blog/[slug].astro`

Current relevant section of `[slug].astro`:
```astro
const { post } = Astro.props;
const { Content } = await post.render();
```
And lower:
```astro
<div class="prose">
  <Content />
</div>
```

- [ ] **Step 1: Update `src/pages/blog/[slug].astro`**

Add the three imports after the existing `import BaseLayout` line:
```astro
import Callout from '../../components/blog/Callout.astro';
import Figure from '../../components/blog/Figure.astro';
import Icon from '../../components/blog/Icon.astro';
```

Change `<Content />` to:
```astro
<Content components={{ Callout, Figure, Icon }} />
```

Full updated frontmatter section:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Callout from '../../components/blog/Callout.astro';
import Figure from '../../components/blog/Figure.astro';
import Icon from '../../components/blog/Icon.astro';

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
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: inject Callout, Figure, Icon into MDX blog posts"
```

---

## Task 7: Add prose image and figure styles

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add styles to the `.prose` block in `BaseLayout.astro`**

Find the existing line:
```css
.prose blockquote {
```

Insert the following **before** it:
```css
.prose img {
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid var(--color-edge);
  margin: 1.5rem auto;
  display: block;
}
.prose figure {
  margin: 1.5rem 0;
}
.prose figcaption {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-dim);
  margin-top: 0.5rem;
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add prose img, figure, and figcaption styles"
```

---

## Task 8: Rename blog files from .md to .mdx

**Files:**
- Rename: `src/content/blog/building-otaku-community.md` → `.mdx`
- Rename: `src/content/blog/first-week-at-kms-technology.md` → `.mdx`
- Rename: `src/content/blog/expanding-the-stack-building-the-space.md` → `.mdx`

No content changes needed — existing Markdown syntax is fully valid in `.mdx` files.

- [ ] **Step 1: Rename all three files**

```powershell
Rename-Item src/content/blog/building-otaku-community.md src/content/blog/building-otaku-community.mdx
Rename-Item src/content/blog/first-week-at-kms-technology.md src/content/blog/first-week-at-kms-technology.mdx
Rename-Item src/content/blog/expanding-the-stack-building-the-space.md src/content/blog/expanding-the-stack-building-the-space.mdx
```

- [ ] **Step 2: Verify Astro still finds all posts**

```bash
npm run check
```

Expected: 0 errors, no missing collection entries.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/
git commit -m "chore: rename blog posts from .md to .mdx"
```

---

## Task 9: Visual verification

**Files:** None modified — verification only.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: server starts at `http://localhost:4321`, no console errors.

- [ ] **Step 2: Verify existing posts still render**

Open `http://localhost:4321/blog/building-otaku-community` in a browser.

Expected:
- Post renders without errors
- Existing inline images (`![…](…)`) have rounded corners, border, and are centered (new `.prose img` styles)

- [ ] **Step 3: Add a test callout to a post and verify it renders**

Temporarily add to the top of `expanding-the-stack-building-the-space.mdx`, after the frontmatter:

```mdx
<Callout type="tldr">
  Deep dive into Azure and Terraform, orientation day at KMS, and a monitor is incoming.
</Callout>
```

Open `http://localhost:4321/blog/expanding-the-stack-building-the-space` and confirm:
- Orange left border
- ⚡ emoji and "TL;DR" label in orange
- Content visible below

- [ ] **Step 4: Verify Figure component**

Temporarily add to the same post:

```mdx
<Figure src="/avatar.jpg" alt="Test figure" caption="This is a caption" />
```

Confirm: image renders centered with caption below in muted color.

- [ ] **Step 5: Verify Icon component**

Temporarily add inline:

```mdx
Working with <Icon name="logos:terraform" /> Terraform.
```

Confirm: Terraform logo SVG renders inline with the text, vertically aligned.

- [ ] **Step 6: Remove temporary test additions**

Remove the `<Callout>`, `<Figure>`, and `<Icon>` test lines added in steps 3–5.

- [ ] **Step 7: Final commit**

```bash
git add src/content/blog/expanding-the-stack-building-the-space.mdx
git commit -m "chore: clean up verification test additions"
```
