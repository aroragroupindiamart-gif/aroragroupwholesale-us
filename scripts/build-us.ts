/**
 * Dedicated Build Script for Arora Group Wholesale USA
 *
 * Usage:
 *   npx tsx scripts/build-us.ts
 *   npx tsx scripts/build-us.ts --deploy
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, writeFileSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const BRANDS_DIR = path.join(ROOT_DIR, 'configs', 'brands');
const OUT_DIR = path.join(ROOT_DIR, 'artifacts', 'ornament', 'dist', 'public');

const args = process.argv.slice(2);
const shouldDeploy = args.includes('--deploy');

const brandJsonPath = path.join(BRANDS_DIR, 'aroragroupwholesale-us.json');
if (!existsSync(brandJsonPath)) {
  console.error(`❌ Brand config not found: ${brandJsonPath}`);
  process.exit(1);
}

const brandConfig = JSON.parse(readFileSync(brandJsonPath, 'utf-8'));

const env: Record<string, string> = {
  ...process.env,
  PORT: process.env.PORT || '3000',
  BASE_PATH: process.env.BASE_PATH || '/',
  VITE_BRAND_ID: brandConfig.id,
  VITE_BRAND_NAME: brandConfig.brandName,
  VITE_SITE_URL: brandConfig.siteUrl,
  VITE_WHATSAPP_NUMBER: brandConfig.whatsappNumber,
  VITE_PHONE: brandConfig.phone || '',
  VITE_ADDRESS: brandConfig.address || '',
  VITE_FOUNDER_VIDEO_ID: brandConfig.founderVideoId || '',
  VITE_GOOGLE_MAPS_URL: brandConfig.googleMapsUrl || '',
  VITE_INSTAGRAM_URL: brandConfig.instagramUrl || '',
  VITE_YOUTUBE_URL: brandConfig.youtubeUrl || '',
  VITE_FACEBOOK_URL: brandConfig.facebookUrl || '',
  VITE_TOP_BANNER: brandConfig.topBanner || '',
  VITE_HERO_BADGE: brandConfig.heroBadge || '',
  VITE_HERO_TITLE: brandConfig.heroTitle || '',
  VITE_HERO_DESCRIPTION: brandConfig.heroDescription || '',
  VITE_ABOUT_TITLE: brandConfig.aboutTitle || '',
  VITE_ABOUT_STORY: brandConfig.aboutStory || '',
};

console.log('\n======================================================');
console.log('🇺🇸 ARORA GROUP WHOLESALE USA — BUILD PIPELINE');
console.log('======================================================');
console.log(`🌐 Target Domain : ${brandConfig.siteUrl}`);
console.log(`🏷️  Brand Name   : ${brandConfig.brandName}`);
console.log(`📱 WhatsApp      : ${brandConfig.whatsappNumber}`);
console.log('======================================================\n');

try {
  console.log('⚡ Step 1: Building Vite client bundle for US…');
  const ornamentDir = path.join(ROOT_DIR, 'artifacts', 'ornament');
  execSync('npx vite build --config vite.config.ts', {
    cwd: ornamentDir,
    env,
    stdio: 'inherit',
  });

  console.log('\n⚡ Step 2: Running dedicated US SSG generator (generate-ssg-us.ts)…');
  execSync('npx tsx scripts/generate-ssg-us.ts', {
    cwd: ornamentDir,
    env,
    stdio: 'inherit',
  });
} catch (err) {
  console.error('❌ Build failed!');
  process.exit(1);
}

console.log('\n⚡ Step 3: Writing Cloudflare Pages configs (_headers, _redirects, robots.txt)…');

const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=3600, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=86400

/robots.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=86400
`;

const redirectsContent = `# Cloudflare Pages Clean Redirects
/sitemap.xml /sitemap.xml 200
/* /index.html 200
`;

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${brandConfig.siteUrl}/sitemap.xml
`;

writeFileSync(path.join(OUT_DIR, '_headers'), headersContent, 'utf-8');
writeFileSync(path.join(OUT_DIR, '_redirects'), redirectsContent, 'utf-8');
writeFileSync(path.join(OUT_DIR, 'robots.txt'), robotsContent, 'utf-8');

function countFiles(dir: string, ext: string): number {
  let count = 0;
  if (!existsSync(dir)) return 0;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      count += countFiles(full, ext);
    } else if (entry.endsWith(ext)) {
      count++;
    }
  }
  return count;
}

const pageCount = countFiles(OUT_DIR, '.html');
const sitemapCount = countFiles(OUT_DIR, '.xml');

console.log('\n======================================================');
console.log('✅ USA pSEO SITE BUILD COMPLETE!');
console.log('======================================================');
console.log(`📁 Output Folder : ${path.relative(ROOT_DIR, OUT_DIR)}`);
console.log(`📄 HTML Pages   : ${pageCount} pre-rendered pages`);
console.log(`🗺️  XML Sitemaps : ${sitemapCount} sitemaps generated`);
console.log(`☁️  Cloudflare   : _headers, _redirects, and robots.txt configured`);
console.log('======================================================\n');

if (shouldDeploy) {
  console.log('🚀 Deploying to Cloudflare Pages (aroragroupwholesale-us)…');
  execSync(`npx wrangler pages deploy artifacts/ornament/dist/public --project-name=${brandConfig.id} --commit-dirty=true`, {
    cwd: ROOT_DIR,
    env,
    stdio: 'inherit',
  });
}
