# Rich Blog Visuals — Design Spec

**Date:** 2026-06-05  
**Status:** Approved  
**Goal:** Upgrade blog posts from text-only to visually rich content supporting styled images, GIFs, inline SVG icons, and callout boxes.

---

## 1. Approach

Migrate blog content from Markdown (`.md`) to MDX (`.mdx`) using Astro's built-in MDX integration. Create three reusable components injected globally into all blog posts — no per-file imports required.

---

## 2. Setup Changes

### `astro.config.mjs`
- Add `@astrojs/mdx` to the integrations array.

### File renames (content only, no edits)
- `building-otaku-community.md` → `.mdx`
- `first-week-at-kms-technology.md` → `.mdx`
- `expanding-the-stack-building-the-space.md` → `.mdx`

### `src/pages/blog/[slug].astro`
- Pass components object to `<Content components={{ Callout, Figure, Icon }} />` so authors never need to import inside `.mdx` files.

---

## 3. New Components

All components live in `src/components/blog/`.

### `Callout.astro`

Props: `type: 'tip' | 'warning' | 'info' | 'note' | 'update' | 'tldr'`

Renders a styled `<div>` with:
- Background: `--color-surface`
- Left border (3px solid, color per type — see table)
- Emoji + bold label on first line
- Slot content below

| Type    | Emoji | Border color |
|---------|-------|--------------|
| tip     | 💡    | `#58a6ff`    |
| warning | ⚠️    | `#d29922`    |
| info    | ℹ️    | `#8b949e`    |
| note    | 📝    | `#bc8cff`    |
| update  | 🔄    | `#3fb950`    |
| tldr    | ⚡    | `#f0883e`    |

Usage:
```mdx
<Callout type="tip">
  Terraform workspaces are not a replacement for separate environments.
</Callout>
```

### `Figure.astro`

Props: `src: string`, `alt: string`, `caption?: string`

Renders a `<figure>` with:
- `<img>` — max-width 100%, border-radius 8px, `border: 1px solid var(--color-edge)`, centered
- `<figcaption>` (if caption provided) — centered, `0.85rem`, `--color-dim`

Usage:
```mdx
<Figure src="/otaku-community-01.png" alt="News feed" caption="The main feed" />
```

Plain markdown `![]()` still works for images that don't need captions.

### `Icon.astro`

Props: `name: string`, `size?: string` (default `1em`)

Wraps `@iconify/astro`. Only referenced icons are bundled — no full icon font.

Usage:
```mdx
Working with <Icon name="logos:terraform" /> Terraform and <Icon name="logos:azure" /> Azure.
```

---

## 4. Prose Style Additions (`BaseLayout.astro`)

Add to the existing `.prose` block:

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

GIFs are handled by `.prose img` — no special treatment needed.

---

## 5. Final File Structure

```
src/
  components/
    blog/
      Callout.astro       ← new
      Figure.astro        ← new
      Icon.astro          ← new
  content/
    blog/
      building-otaku-community.mdx              ← renamed
      first-week-at-kms-technology.mdx          ← renamed
      expanding-the-stack-building-the-space.mdx ← renamed
  pages/
    blog/
      [slug].astro        ← updated: inject components + import mdx
  layouts/
    BaseLayout.astro      ← updated: prose img/figure/figcaption styles
astro.config.mjs          ← updated: add mdx integration
```

---

## 6. Out of Scope

- Video embeds
- Interactive components (e.g. tabs, accordions)
- Image lightbox / zoom
- Automatic image optimization (Astro's `<Image />` component) — can be added later
