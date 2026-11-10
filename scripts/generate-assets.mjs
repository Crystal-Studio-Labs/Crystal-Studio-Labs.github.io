import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');
const ogDir = join(publicDir, 'og');
const ogProjectsDir = join(ogDir, 'projects');

// Ensure directories exist
if (!existsSync(ogDir)) mkdirSync(ogDir, { recursive: true });
if (!existsSync(ogProjectsDir)) mkdirSync(ogProjectsDir, { recursive: true });

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateAssets() {
  console.log('[ASSETS] Generating brand icons and full Open Graph / Twitter Card suite...');

  // 1. Apple Touch Icon (180x180)
  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
      <rect width="180" height="180" fill="#0A0D12"/>
      <rect x="6" y="6" width="168" height="168" fill="none" stroke="#00F0FF" stroke-width="8"/>
      <polygon points="90,30 150,90 90,150 30,90" fill="none" stroke="#00F0FF" stroke-width="9"/>
      <rect x="76" y="76" width="28" height="28" fill="#00FF66"/>
    </svg>
  `;
  await sharp(Buffer.from(iconSvg))
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('[ASSETS] ✓ Generated apple-touch-icon.png');

  // 2. Favicon ICO (48x48)
  await sharp(Buffer.from(iconSvg))
    .resize(48, 48)
    .png()
    .toFile(join(publicDir, 'favicon.ico'));
  console.log('[ASSETS] ✓ Generated favicon.ico');

  // 3. Default Root Open Graph & Twitter Card (1200x630)
  const baseOgSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        </pattern>
      </defs>
      
      <rect width="1200" height="630" fill="#0A0D12"/>
      <rect width="1200" height="630" fill="url(#grid)"/>

      <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#2B3548" stroke-width="4"/>
      <rect x="20" y="20" width="1160" height="590" fill="none" stroke="#00F0FF" stroke-width="2"/>

      <rect x="40" y="44" width="1120" height="52" fill="#151B27" stroke="#2B3548" stroke-width="2"/>
      <text x="60" y="77" font-family="monospace" font-size="20" font-weight="bold" fill="#00F0FF">// CRYSTAL_STUDIO_LABS :: OFFICIAL_DEVELOPER_PLATFORM</text>
      <text x="1000" y="77" font-family="monospace" font-size="18" font-weight="bold" fill="#00FF66">[SYS_OK]</text>

      <polygon points="120,240 180,300 120,360 60,300" fill="none" stroke="#00F0FF" stroke-width="8"/>
      <rect x="106" y="286" width="28" height="28" fill="#00FF66"/>

      <text x="220" y="275" font-family="sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" letter-spacing="-1">CRYSTAL STUDIO LABS</text>
      <text x="220" y="330" font-family="monospace" font-size="24" font-weight="bold" fill="#00F0FF">AUTONOMOUS SYSTEMS // DEVELOPER TOOLING // FLEET PORTAL</text>
      <text x="220" y="375" font-family="sans-serif" font-size="22" fill="#94A3B8">18 Real Open-Source Repositories • Strict &lt;25MB Memory Ceiling • Zero Telemetry</text>

      <rect x="220" y="430" width="200" height="44" fill="#151B27" stroke="#00F0FF" stroke-width="2"/>
      <text x="240" y="458" font-family="monospace" font-size="16" font-weight="bold" fill="#00F0FF">18 REPOSITORIES</text>

      <rect x="440" y="430" width="230" height="44" fill="#151B27" stroke="#00FF66" stroke-width="2"/>
      <text x="460" y="458" font-family="monospace" font-size="16" font-weight="bold" fill="#00FF66">&lt;25MB MEMORY CEILING</text>

      <rect x="690" y="430" width="220" height="44" fill="#151B27" stroke="#2B3548" stroke-width="2"/>
      <text x="710" y="458" font-family="monospace" font-size="16" font-weight="bold" fill="#FFFFFF">ZERO VENDOR TELEMETRY</text>

      <rect x="930" y="430" width="210" height="44" fill="#151B27" stroke="#2B3548" stroke-width="2"/>
      <text x="950" y="458" font-family="monospace" font-size="16" font-weight="bold" fill="#FFFFFF">100% STATIC PAGES</text>

      <line x1="40" y1="540" x2="1160" y2="540" stroke="#2B3548" stroke-width="2"/>
      <text x="40" y="575" font-family="monospace" font-size="16" fill="#64748B">HOSTED ON GITHUB PAGES: crystal-studio-labs.github.io</text>
      <text x="960" y="575" font-family="monospace" font-size="16" fill="#00F0FF">LICENSE: MIT OPEN SOURCE</text>
    </svg>
  `;
  await sharp(Buffer.from(baseOgSvg))
    .png()
    .toFile(join(publicDir, 'og-image.png'));
  console.log('[ASSETS] ✓ Generated og-image.png (1200x630)');

  // 4. Key Pages Banners (Projects, About, Get Involved)
  const pageCards = [
    {
      slug: 'projects',
      title: 'FLEET DIRECTORY',
      subtitle: 'ALL 18 REPOSITORIES // LIVE SEARCH & FILTERS',
      tag: '02 // REPOSITORY_DIRECTORY',
      badge: '18 OPEN-SOURCE REPOSITORIES'
    },
    {
      slug: 'about',
      title: 'ABOUT & ARCHITECTURE',
      subtitle: 'THE 4 INVARIANTS // ZERO TELEMETRY // SYSTEMS FOCUS',
      tag: '01 // ORGANIZATION_PROFILE',
      badge: 'MISSION & INVARIANTS'
    },
    {
      slug: 'get-involved',
      title: 'GET INVOLVED // CONTRIBUTE',
      subtitle: '4-STAGE RFC PROCESS // SECURITY DISCLOSURE // STANDARDS',
      tag: '03 // OPEN_SOURCE_COLLABORATION',
      badge: 'RFC LIFECYCLE'
    }
  ];

  for (const p of pageCards) {
    const pageSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          </pattern>
        </defs>
        
        <rect width="1200" height="630" fill="#0A0D12"/>
        <rect width="1200" height="630" fill="url(#grid)"/>

        <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#2B3548" stroke-width="4"/>
        <rect x="20" y="20" width="1160" height="590" fill="none" stroke="#00F0FF" stroke-width="2"/>

        <rect x="40" y="44" width="1120" height="52" fill="#151B27" stroke="#2B3548" stroke-width="2"/>
        <text x="60" y="77" font-family="monospace" font-size="20" font-weight="bold" fill="#00F0FF">// CRYSTAL_STUDIO_LABS :: ${escapeXml(p.tag)}</text>
        <text x="1000" y="77" font-family="monospace" font-size="18" font-weight="bold" fill="#00FF66">[SYS_OK]</text>

        <polygon points="120,240 180,300 120,360 60,300" fill="none" stroke="#00F0FF" stroke-width="8"/>
        <rect x="106" y="286" width="28" height="28" fill="#00FF66"/>

        <text x="220" y="275" font-family="sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" letter-spacing="-1">${escapeXml(p.title)}</text>
        <text x="220" y="330" font-family="monospace" font-size="22" font-weight="bold" fill="#00F0FF">${escapeXml(p.subtitle)}</text>
        <text x="220" y="375" font-family="sans-serif" font-size="22" fill="#94A3B8">Official Platform • Crystal Studio Labs</text>

        <rect x="220" y="430" width="300" height="44" fill="#151B27" stroke="#00F0FF" stroke-width="2"/>
        <text x="240" y="458" font-family="monospace" font-size="16" font-weight="bold" fill="#00F0FF">${escapeXml(p.badge)}</text>

        <rect x="540" y="430" width="260" height="44" fill="#151B27" stroke="#00FF66" stroke-width="2"/>
        <text x="560" y="458" font-family="monospace" font-size="16" font-weight="bold" fill="#00FF66">&lt;25MB MEMORY CEILING</text>

        <line x1="40" y1="540" x2="1160" y2="540" stroke="#2B3548" stroke-width="2"/>
        <text x="40" y="575" font-family="monospace" font-size="16" fill="#64748B">crystal-studio-labs.github.io/${p.slug}/</text>
        <text x="960" y="575" font-family="monospace" font-size="16" fill="#00F0FF">LICENSE: MIT OPEN SOURCE</text>
      </svg>
    `;
    await sharp(Buffer.from(pageSvg))
      .png()
      .toFile(join(ogDir, `${p.slug}.png`));
    console.log(`[ASSETS] ✓ Generated og/${p.slug}.png`);
  }

  // 5. Generate Individual Social Cards for All 18 Projects
  const projects = JSON.parse(readFileSync(join(rootDir, 'data', 'projects.json'), 'utf-8'));
  for (const proj of projects) {
    const stars = proj.githubStats?.stars || 0;
    const lang = proj.githubStats?.language || 'Shell';
    const projSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          </pattern>
        </defs>
        
        <rect width="1200" height="630" fill="#0A0D12"/>
        <rect width="1200" height="630" fill="url(#grid)"/>

        <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#2B3548" stroke-width="4"/>
        <rect x="20" y="20" width="1160" height="590" fill="none" stroke="#00F0FF" stroke-width="2"/>

        <!-- Top Header Bar -->
        <rect x="40" y="44" width="1120" height="52" fill="#151B27" stroke="#2B3548" stroke-width="2"/>
        <text x="60" y="77" font-family="monospace" font-size="20" font-weight="bold" fill="#00F0FF">// CRYSTAL_STUDIO_LABS :: SPEC_SHEET</text>
        <text x="960" y="77" font-family="monospace" font-size="18" font-weight="bold" fill="#00FF66">[● ${proj.status.toUpperCase()}]</text>

        <!-- Main Project Headline -->
        <text x="60" y="190" font-family="sans-serif" font-size="56" font-weight="900" fill="#FFFFFF" letter-spacing="-1">${escapeXml(proj.name)}</text>
        <text x="60" y="240" font-family="monospace" font-size="22" font-weight="bold" fill="#00F0FF">${escapeXml(proj.tagline.substring(0, 75))}</text>

        <!-- Badges Row -->
        <rect x="60" y="280" width="180" height="44" fill="#151B27" stroke="#00F0FF" stroke-width="2"/>
        <text x="80" y="308" font-family="monospace" font-size="16" font-weight="bold" fill="#00F0FF">${escapeXml(proj.category)}</text>

        <rect x="260" y="280" width="160" height="44" fill="#151B27" stroke="#00FF66" stroke-width="2"/>
        <text x="280" y="308" font-family="monospace" font-size="16" font-weight="bold" fill="#00FF66">${escapeXml(lang)}</text>

        <rect x="440" y="280" width="140" height="44" fill="#151B27" stroke="#2B3548" stroke-width="2"/>
        <text x="460" y="308" font-family="monospace" font-size="16" font-weight="bold" fill="#FFFFFF">★ ${stars} STARS</text>

        <rect x="600" y="280" width="150" height="44" fill="#151B27" stroke="#2B3548" stroke-width="2"/>
        <text x="620" y="308" font-family="monospace" font-size="16" font-weight="bold" fill="#FFFFFF">MIT LICENSE</text>

        <!-- Terminal Install Preview Box -->
        <rect x="60" y="360" width="1080" height="90" fill="#07090D" stroke="#2B3548" stroke-width="2"/>
        <text x="85" y="415" font-family="monospace" font-size="20" fill="#38BDF8">$ ${escapeXml((proj.install || 'git clone https://github.com/' + proj.repo).substring(0, 80))}</text>

        <!-- Invariants Footer Row -->
        <text x="60" y="500" font-family="sans-serif" font-size="18" fill="#94A3B8">Invariants: Strict &lt;25MB Memory Ceiling • Zero Telemetry • Permissive Open Source</text>

        <line x1="40" y1="540" x2="1160" y2="540" stroke="#2B3548" stroke-width="2"/>
        <text x="40" y="575" font-family="monospace" font-size="16" fill="#64748B">github.com/${escapeXml(proj.repo)}</text>
        <text x="880" y="575" font-family="monospace" font-size="16" fill="#00F0FF">crystal-studio-labs.github.io/projects/${proj.id}/</text>
      </svg>
    `;
    await sharp(Buffer.from(projSvg))
      .png()
      .toFile(join(ogProjectsDir, `${proj.id}.png`));
  }
  console.log(`[ASSETS] ✓ Generated ${projects.length} dedicated project social cards in public/og/projects/`);
}

generateAssets().catch(err => {
  console.error('[ASSETS] Generation error:', err);
  process.exit(1);
});
