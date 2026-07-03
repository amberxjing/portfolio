# Amber Portfolio

Vite + React portfolio site for Amber Xu.

Live site: https://amberxjing.github.io/portfolio/

## Structure

```text
docs/
  作品集网站结构.md
  taste-studies/

public/
  assets/
    amber-portrait.png
    resume.png
  favicon.svg

src/
  components/
  data/
  pages/
  styles/
  App.jsx
  main.jsx

index.html
package.json
vite.config.js
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deployment

GitHub Actions deploys `main` to GitHub Pages automatically after each push.

## Editing

- Update project placeholders in `src/data/projects.js`.
- Update page-level content in `src/pages/`.
- Update shared UI in `src/components/`.
- Update visual system styles in `src/styles/globals.css`.
- Replace static assets in `public/assets/`.
