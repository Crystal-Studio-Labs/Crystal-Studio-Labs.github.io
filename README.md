# ◈ Crystal Studio Labs — Official Platform

[![Static Build & GitHub Pages Deployment](https://github.com/Crystal-Studio-Labs/Crystal-Studio-Labs.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Crystal-Studio-Labs/Crystal-Studio-Labs.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Astro 5](https://img.shields.io/badge/Framework-Astro_5-orange.svg)](https://astro.build)
[![Status: 100% Static Native](https://img.shields.io/badge/Status-100%25_Static_Native-00FF66.svg)](#)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-Zero_Tracking-00F0FF.svg)](#)

The authoritative, open-source developer portal and repository catalog for **Crystal Studio Labs** ([crystal-studio-labs.github.io](https://crystal-studio-labs.github.io)).

---

## ⚡ Architectural Principles

1. **100% Static Pre-Rendering**: Zero server runtime and zero hydration penalty on content. Every route, OpenGraph preview, Twitter card, and JSON-LD schema is pre-rendered at build time.
2. **Data-Driven Decoupling**: All catalog entries live in `data/projects.json` governed by `data/projects.schema.json`. Adding or updating a project requires zero UI code edits.
3. **Build-Time GitHub Fleet Telemetry**: Automatically syncs real star counts, forks, languages, and commit timestamps directly from the GitHub REST API (`https://api.github.com/orgs/Crystal-Studio-Labs/repos`).
4. **Cyber-Brutalist Design System**: High-contrast, tactile interface featuring 3-4px solid borders, sharp corners, hard offset shadows, electric cyan accents, monospace HUD telemetry, and WCAG AA accessible contrast.
5. **Zero Vendor Telemetry**: No third-party trackers, no invasive advertising, and no synthetic marketing metrics.

---

## 🛠️ Quick Start & Local Development

### Prerequisites
- **Node.js**: v20+ or v22+ LTS
- **npm**: v10+

### Installation & Development Server
```bash
# Clone the repository
git clone https://github.com/Crystal-Studio-Labs/Crystal-Studio-Labs.github.io.git
cd Crystal-Studio-Labs.github.io

# Install dependencies
npm install

# Start local Astro development server with HMR
npm run dev
```
Visit `http://localhost:4321` in your browser.

### Data Validation
Run the schema integrity check against `data/projects.json`, `data/site.json`, and `data/team.json`:
```bash
npm run validate:data
```

### GitHub API Telemetry Synchronization
Fetch the latest live repository statistics from GitHub:
```bash
npm run fetch:stats
```

### Production Build & Preview
```bash
# Build 100% static output to dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 GitHub Pages Deployment Setup

This website deploys via **GitHub Actions** directly to GitHub Pages.

1. Navigate to the GitHub repository: `https://github.com/Crystal-Studio-Labs/Crystal-Studio-Labs.github.io/settings/pages`.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Any push to `main` will automatically trigger `.github/workflows/deploy.yml`:
   - Validates JSON schemas (`npm run validate:data`)
   - Fetches live GitHub stars and commits (`npm run fetch:stats`)
   - Compiles static routes and sitemaps (`npx astro build`)
   - Publishes directly to GitHub Pages via `actions/deploy-pages`

### Custom Domain Configuration (Optional)
To use a custom domain (e.g. `crystalstudiolabs.org`):
1. Add a `CNAME` file in `public/CNAME` containing your domain:
   ```txt
   crystalstudiolabs.org
   ```
2. Update `site` in `astro.config.mjs` and `url` in `data/site.json`:
   ```javascript
   site: 'https://crystalstudiolabs.org'
   ```
3. In your DNS provider, configure:
   - Apex domain (`@`): `A` records pointing to GitHub Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`)
   - Subdomain (`www`): `CNAME` record pointing to `Crystal-Studio-Labs.github.io`

---

## 📂 Project Structure

```text
Crystal-Studio-Labs.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages build & deploy workflow
├── data/
│   ├── projects.json           # Catalog of all 18 repositories
│   ├── projects.schema.json    # JSON Schema definition
│   ├── site.json               # Organization metadata and navigation
│   └── team.json               # Maintainers and contributors roster
├── public/
│   ├── .nojekyll               # Disables Jekyll processing on Pages
│   ├── favicon.svg             # Vector cyber-brutalist icon
│   ├── favicon.ico             # Legacy ICO fallback
│   ├── apple-touch-icon.png    # 180x180 iOS home icon
│   ├── og-image.png            # 1200x630 OpenGraph social preview
│   ├── robots.txt              # Crawler permissions
│   └── site.webmanifest        # PWA configuration
├── scripts/
│   ├── fetch-github-stats.mjs  # GitHub REST API sync script
│   ├── generate-assets.mjs     # Sharp asset generator
│   └── validate-data.mjs       # Data integrity test suite
├── src/
│   ├── components/
│   │   ├── FleetCharts.astro   # SVG language & star distribution charts
│   │   ├── Footer.astro        # Cyber-brutalist footer
│   │   ├── Header.astro        # Responsive nav + mobile drawer + theme toggle
│   │   ├── InstallCommand.astro# Copy-to-clipboard command snippet
│   │   └── ProjectCard.astro   # Standardized repository card
│   ├── layouts/
│   │   └── BaseLayout.astro    # Master HTML shell, SEO, OG, and JSON-LD
│   ├── pages/
│   │   ├── index.astro         # Home page (hero, ticker, stats, invariants)
│   │   ├── 404.astro           # Cyber-brutalist error screen
│   │   ├── about/index.astro   # Mission, domains, maintainers
│   │   ├── get-involved/       # RFC lifecycle, PR rules, vulnerability disclosure
│   │   └── projects/
│   │       ├── index.astro     # Searchable, filterable repository catalog
│   │       └── [id].astro      # Static detail page per repository
│   └── styles/
│       └── global.css          # Design tokens, cyber grid, themes, scanlines
├── astro.config.mjs            # Astro configuration (base, site, sitemap)
├── CONTRIBUTING-CONTENT.md     # Guide for adding/editing project data
├── package.json
├── RESEARCH.md                 # Design & architectural research benchmark
└── tsconfig.json
```

---

## 📝 Adding & Editing Content

Refer to [CONTRIBUTING-CONTENT.md](CONTRIBUTING-CONTENT.md) for copy-paste JSON templates and instructions on adding or modifying repositories in the catalog.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
All telemetry probers and systems utilities are published under permissive open-source licenses.
