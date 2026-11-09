#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const projectsPath = join(rootDir, 'data', 'projects.json');
const publicDir = join(rootDir, 'public');
const cachePath = join(publicDir, 'github-fleet-cache.json');

console.log('[GITHUB-SYNC] Fetching live fleet stats from GitHub API...');

async function syncFleetStats() {
  let projects = [];
  try {
    projects = JSON.parse(readFileSync(projectsPath, 'utf-8'));
  } catch (err) {
    console.error(`[GITHUB-SYNC] Error reading ${projectsPath}: ${err.message}`);
    process.exit(0); // non-fatal fallback
  }

  const headers = {
    'User-Agent': 'Crystal-Studio-Labs-Portal-Sync'
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    console.log('[GITHUB-SYNC] Authenticated GitHub request token detected.');
  }

  try {
    const res = await fetch('https://api.github.com/orgs/Crystal-Studio-Labs/repos?per_page=100', { headers });

    if (!res.ok) {
      console.warn(`[GITHUB-SYNC] GitHub API returned status ${res.status}: ${res.statusText}. Using fallback stats.`);
      return;
    }

    const repos = await res.json();
    console.log(`[GITHUB-SYNC] Received ${repos.length} repositories from GitHub API.`);

    const repoMap = new Map();
    for (const r of repos) {
      repoMap.set(r.name.toLowerCase(), r);
    }

    let updatedCount = 0;
    for (const p of projects) {
      const repoName = p.repo.split('/')[1]?.toLowerCase();
      if (repoName && repoMap.has(repoName)) {
        const remote = repoMap.get(repoName);
        p.githubStats = {
          stars: remote.stargazers_count ?? p.githubStats?.stars ?? 0,
          forks: remote.forks_count ?? p.githubStats?.forks ?? 0,
          language: remote.language ?? p.githubStats?.language ?? 'Shell',
          lastPush: remote.pushed_at ?? p.githubStats?.lastPush ?? new Date().toISOString()
        };
        updatedCount++;
      }
    }

    writeFileSync(projectsPath, JSON.stringify(projects, null, 2) + '\n');
    console.log(`[GITHUB-SYNC] Successfully synchronized ${updatedCount} repositories in data/projects.json.`);

    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }

    const cachePayload = {
      timestamp: new Date().toISOString(),
      repos: Array.from(repoMap.values()).map(r => ({
        name: r.name,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        pushed_at: r.pushed_at
      }))
    };
    writeFileSync(cachePath, JSON.stringify(cachePayload, null, 2) + '\n');
    console.log(`[GITHUB-SYNC] Wrote public telemetry cache to ${cachePath}.`);

  } catch (err) {
    console.warn(`[GITHUB-SYNC] Network or rate limit warning: ${err.message}. Retaining cached build stats.`);
  }
}

await syncFleetStats();
