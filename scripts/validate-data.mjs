#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('[VALIDATE] Auditing data layer integrity...');

let errors = [];

// 1. Audit projects.json
try {
  const projectsRaw = readFileSync(join(rootDir, 'data', 'projects.json'), 'utf-8');
  const projects = JSON.parse(projectsRaw);

  if (!Array.isArray(projects) || projects.length === 0) {
    errors.push('data/projects.json must be a non-empty array');
  } else {
    const ids = new Set();
    const validStatuses = new Set(['active', 'beta', 'planned', 'archived']);

    projects.forEach((proj, idx) => {
      const prefix = `[Project #${idx + 1} (${proj.name || 'unnamed'})]`;

      if (!proj.id || !/^[a-z0-9-]+$/.test(proj.id)) {
        errors.push(`${prefix} Invalid id: "${proj.id}". Must be lowercase alphanumeric with hyphens.`);
      }
      if (ids.has(proj.id)) {
        errors.push(`${prefix} Duplicate id detected: "${proj.id}". IDs must be strictly unique.`);
      }
      ids.add(proj.id);

      if (!proj.name || typeof proj.name !== 'string') errors.push(`${prefix} Missing required string 'name'.`);
      if (!proj.tagline || typeof proj.tagline !== 'string') errors.push(`${prefix} Missing required string 'tagline'.`);
      if (!proj.description || typeof proj.description !== 'string') errors.push(`${prefix} Missing required string 'description'.`);

      if (!validStatuses.has(proj.status)) {
        errors.push(`${prefix} Invalid status: "${proj.status}". Expected one of: ${[...validStatuses].join(', ')}.`);
      }

      if (!proj.category || typeof proj.category !== 'string') errors.push(`${prefix} Missing required string 'category'.`);
      if (!Array.isArray(proj.tags) || proj.tags.length === 0) errors.push(`${prefix} 'tags' must be a non-empty array of strings.`);
      if (!Array.isArray(proj.features) || proj.features.length === 0) errors.push(`${prefix} 'features' must be a non-empty array of strings.`);

      if (!proj.repo || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(proj.repo)) {
        errors.push(`${prefix} Invalid repo format: "${proj.repo}". Expected "owner/repo".`);
      }

      if (typeof proj.featured !== 'boolean') errors.push(`${prefix} 'featured' must be a boolean.`);
      if (typeof proj.order !== 'number') errors.push(`${prefix} 'order' must be an integer.`);
    });
    console.log(`[VALIDATE] Validated ${projects.length} projects successfully.`);
  }
} catch (err) {
  errors.push(`Failed reading or parsing data/projects.json: ${err.message}`);
}

// 2. Audit site.json
try {
  const siteRaw = readFileSync(join(rootDir, 'data', 'site.json'), 'utf-8');
  const site = JSON.parse(siteRaw);
  if (!site.name || !site.url || !Array.isArray(site.nav) || site.nav.length === 0) {
    errors.push('data/site.json missing required top-level configuration (name, url, or nav).');
  } else {
    console.log(`[VALIDATE] Site configuration '${site.name}' validated.`);
  }
} catch (err) {
  errors.push(`Failed reading or parsing data/site.json: ${err.message}`);
}

// 3. Audit team.json
try {
  const teamRaw = readFileSync(join(rootDir, 'data', 'team.json'), 'utf-8');
  const team = JSON.parse(teamRaw);
  if (!Array.isArray(team)) {
    errors.push('data/team.json must be an array of team members.');
  } else {
    console.log(`[VALIDATE] Team roster (${team.length} members) validated.`);
  }
} catch (err) {
  errors.push(`Failed reading or parsing data/team.json: ${err.message}`);
}

if (errors.length > 0) {
  console.error('\n❌ VALIDATION FAILED WITH ERRORS:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('\n✅ ALL DATASETS PASSED INTEGRITY AUDIT.\n');
  process.exit(0);
}
