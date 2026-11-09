# Content Contribution Guide: Managing the Repository Catalog

All project data in **Crystal Studio Labs** is completely decoupled from UI code and managed directly inside `data/projects.json`. Adding, updating, or archiving a repository requires editing only this JSON file—no frontend code modifications are necessary.

---

## 1. How to Add a New Project

1. Open `data/projects.json`.
2. Append a new project object to the array following the template below.
3. Verify that your `id` is lowercase and hyphenated (e.g. `my-new-tool`).
4. Run the validation script:
   ```bash
   npm run validate:data
   ```
5. Commit and push. GitHub Actions will validate the schema, fetch live GitHub stats, generate the new `/projects/<id>/` static route, update the sitemap, and deploy automatically.

### Copy-Paste JSON Template

```json
{
  "id": "my-tool-name",
  "name": "MyToolName",
  "tagline": "One concise sentence describing what the tool accomplishes",
  "description": "Full technical paragraph explaining the architecture, problem solved, implementation language, and zero-dependency guarantees.",
  "status": "active",
  "category": "CLI & Tools",
  "tags": ["Linux", "CLI", "Shell", "Systems"],
  "repo": "Crystal-Studio-Labs/MyToolName",
  "homepage": "https://github.com/Crystal-Studio-Labs/MyToolName",
  "install": "curl -fsSL https://raw.githubusercontent.com/Crystal-Studio-Labs/MyToolName/main/install.sh | bash",
  "usage": "mytool --inspect --port 8080",
  "features": [
    "Strict sub-25MB memory ceiling",
    "Zero native C/gyp dependencies",
    "100% offline-first execution",
    "POSIX-compliant shell and container support"
  ],
  "featured": true,
  "order": 19,
  "githubStats": {
    "stars": 0,
    "forks": 0,
    "language": "Shell",
    "lastPush": "2026-11-09T00:00:00Z"
  }
}
```

---

## 2. Field Specifications & Enums

| Field | Type | Description | Allowed Values / Format |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Unique URL slug | Lowercase alphanumeric with hyphens (`^[a-z0-9-]+$`) |
| `name` | `string` | Display project title | Plain text |
| `tagline` | `string` | Short 1-sentence value proposition | Plain text |
| `description`| `string` | Exhaustive technical paragraph | Factual description |
| `status` | `string` | Current lifecycle state | `active`, `beta`, `planned`, `archived` |
| `category` | `string` | Domain grouping | `CLI & Tools`, `Systems & SDKs`, `Networks & Protocols`, `Observability`, `Web & UI`, `Developer Tools`, `Security & Auth`, `AI & Machine Learning`, `Automation & Bots`, `Documentation` |
| `tags` | `string[]` | Search and filter tags | Array of strings |
| `repo` | `string` | GitHub repository identifier | `Crystal-Studio-Labs/<repo-name>` |
| `homepage` | `string` | Documentation or repo URL | Absolute HTTPS URL |
| `install` | `string` | CLI or package manager command | `npm i`, `pip install`, `curl \| bash`, etc. |
| `usage` | `string` | Primary CLI or SDK invocation | Runnable code snippet |
| `features` | `string[]` | Architectural invariants & features | Minimum 3 technical bullet points |
| `featured` | `boolean` | Display in home page flagship showcase | `true` or `false` |
| `order` | `integer` | Default catalog display sort | Unique positive integer |

---

## 3. How to Update or Archive a Project

### To Update Stats Manually or Force Sync:
```bash
npm run fetch:stats
```
This queries the GitHub REST API and updates `data/projects.json` and `public/github-fleet-cache.json` with the latest live stars, forks, and push dates.

### To Mark as Archived:
Change `"status": "archived"` and `"featured": false`. The UI will automatically render a muted status badge and adjust filter grouping.

### To Remove a Project:
Delete the object from `data/projects.json`, run `npm run validate:data`, and commit. Astro's `getStaticPaths` will immediately prune the route from the build and sitemap.
