# CODEX

CODEX is a Next.js interface explorer that combines the work completed in `Blueprint` into one deployable app shell.

It includes:
- a native tree organizer view
- a native graph explorer with reduced label noise
- a native logo-map explorer
- portfolio, projects, blog, about, and contact pages inside the same shell

## Local development

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:3000`.

## GitHub Pages deployment

This repo is configured to deploy to:

`https://zainkhan1994.github.io/CODEX/`

Deployment is handled by the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`.

For a local Pages-style build:

```bash
npm run build:pages
```

That exports a static site into `out/`.
