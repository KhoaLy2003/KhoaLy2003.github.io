<p align="center">
  <img src="public/avatar.jpg" alt="Khoa's avatar" width="100" style="border-radius: 50%;" />
</p>

<h1 align="center">khoaly2003.github.io</h1>

<p align="center">
  Personal portfolio and blog of <strong>Ly Ngoc Dang Khoa</strong> — Backend Developer based in Ho Chi Minh City.
  <br />
  <a href="https://khoaly2003.github.io">khoaly2003.github.io</a>
</p>

---

## Stack

- [Astro](https://astro.build) — static site framework
- [Tailwind CSS](https://tailwindcss.com) — styling
- [Preact](https://preactjs.com) — interactive components
- [Shiki](https://shiki.matsu.io) — syntax highlighting in blog posts
- GitHub Actions — automatic deploy to GitHub Pages

## Project structure

```
src/
  components/   # Header, Footer, PostCard, ProjectCard, TagFilter
  content/
    blog/       # Markdown blog posts
    projects/   # Markdown project entries
  layouts/      # BaseLayout
  pages/        # index, about, blog, projects, uses
public/         # static assets (images, favicon)
```

## Local development

```bash
npm install
npm run dev       # start dev server at localhost:4321
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run check     # TypeScript / Astro type checking
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — intro, recent posts, featured projects |
| `/about` | Background, experience, and interests |
| `/blog` | Writing |
| `/projects` | Side projects |
| `/uses` | Hardware and software setup |

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds the site and publishes it to GitHub Pages automatically.
