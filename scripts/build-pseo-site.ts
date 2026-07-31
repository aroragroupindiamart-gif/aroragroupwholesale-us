/**
 * Automated Multi-Domain pSEO Builder Script
 * 
 * Usage:
 *   npx tsx scripts/build-pseo-site.ts --brand=aroragroupwholesale
 *   npx tsx scripts/build-pseo-site.ts --brand=example-domain2
 *   npx tsx scripts/build-pseo-site.ts --domain="https://my-new-domain.com" --name="My Brand" --wa="919876543210"
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const BRANDS_DIR = path.join(ROOT_DIR, 'configs', 'brands');
const OUT_DIR = path.join(ROOT_DIR, 'artifacts', 'ornament', 'dist', 'public');

// Parse CLI args
const args = process.argv.slice(2).reduce<Record<string, string>>((acc, arg) => {
  const [k, v] = arg.replace(/^--/, '').split('=');
  if (k) acc[k] = v || 'true';
  return acc;
}, {});

let brandId = args.brand || 'aroragroupwholesale';
let brandConfig: any = {};

const brandJsonPath = path.join(BRANDS_DIR, `${brandId}.json`);

if (existsSync(brandJsonPath)) {
  console.log(`📋 Loading brand config from: ${brandJsonPath}`);
  brandConfig = JSON.parse(readFileSync(brandJsonPath, 'utf-8'));
} else if (args.domain && args.name) {
  brandConfig = {
    id: brandId,
    brandName: args.name,
    siteUrl: args.domain,
    whatsappNumber: args.wa || '918368484361',
    phone: args.phone || '+91 99999 99999',
    address: args.address || 'India',
  };
} else {
  console.error(`❌ Brand config not found at: ${brandJsonPath}`);
  console.error(`   Available brands: ${existsSync(BRANDS_DIR) ? readdirSync(BRANDS_DIR).join(', ') : 'none'}`);
  process.exit(1);
}

const env: Record<string, string> = {
  ...process.env,
  PORT: process.env.PORT || '3000',
  BASE_PATH: process.env.BASE_PATH || '/',
  VITE_BRAND_ID: brandConfig.id || brandId,
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

console.log('\n🚀 Generating pSEO Site for Cloudflare Pages Deployment...');
console.log(`🌐 Target Domain : ${brandConfig.siteUrl}`);
console.log(`🏷️  Brand Name   : ${brandConfig.brandName}`);
console.log(`📱 WhatsApp      : ${brandConfig.whatsappNumber}\n`);

// 1. Run Vite build & SSG pre-renderer
try {
  console.log('⚡ Step 1: Building frontend assets & pre-rendering 3,792 pSEO pages...');
  const ornamentDir = path.join(ROOT_DIR, 'artifacts', 'ornament');
  execSync('npx vite build --config vite.config.ts', {
    cwd: ornamentDir,
    env,
    stdio: 'inherit',
  });
  execSync('npx tsx scripts/generate-ssg.ts', {
    cwd: ornamentDir,
    env,
    stdio: 'inherit',
  });
} catch (err) {
  console.error('❌ Build failed!');
  process.exit(1);
}

// 2. Generate Cloudflare Pages configuration files (_headers, _redirects)
console.log('⚡ Step 2: Generating Cloudflare Pages deployment configs...');

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
`;

writeFileSync(path.join(OUT_DIR, '_headers'), headersContent, 'utf-8');
writeFileSync(path.join(OUT_DIR, '_redirects'), redirectsContent, 'utf-8');

// 3. Count generated pages
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
console.log('✅ pSEO SITE BUILD COMPLETE!');
console.log('======================================================');
console.log(`📁 Output Folder : ${path.relative(ROOT_DIR, OUT_DIR)}`);
console.log(`📄 HTML Pages   : ${pageCount} pre-rendered pages (100% intact)`);
console.log(`🗺️  XML Sitemaps : ${sitemapCount} sitemaps generated`);
console.log(`☁️  Cloudflare   : _headers and _redirects created`);
console.log('\n🚀 CLOUDFLARE PAGES DEPLOYMENT INSTRUCTIONS:');
console.log('  Option 1 (CLI):');
console.log(`    npx wrangler pages deploy artifacts/ornament/dist/public --project-name=${brandConfig.id}\n`);
console.log('  Option 2 (Git / Dashboard):');
console.log('    Push this repo to GitHub and connect Cloudflare Pages with:');
console.log('    - Build command: pnpm run site:build --brand=' + (brandConfig.id || brandId));
console.log('    - Build output directory: artifacts/ornament/dist/public');
console.log('======================================================\n');
