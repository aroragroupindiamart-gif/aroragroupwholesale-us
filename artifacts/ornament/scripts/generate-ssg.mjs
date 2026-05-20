#!/usr/bin/env node
/**
 * Project Ornament — Static Site Generator + Sitemap Builder
 *
 * Run AFTER `vite build`:
 *   node scripts/generate-ssg.mjs
 *
 * Reads all 3,792 pages from SQLite and writes:
 *   dist/public/{slug}/index.html   — standalone pre-rendered HTML for bots
 *   dist/public/sitemap-index.xml   — sitemap index pointing to regional sitemaps
 *   dist/public/sitemap-north.xml   etc.
 */

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'api-server', 'data', 'ornament.db');
const OUT_DIR = path.join(__dirname, '..', 'dist', 'public');
const BASE_URL = 'https://ornament.replit.app';

if (!existsSync(DB_PATH)) {
  console.error('❌ DB not found at', DB_PATH, '\nRun: pnpm --filter @workspace/api-server run seed');
  process.exit(1);
}

if (!existsSync(OUT_DIR)) {
  console.error('❌ dist/public not found — run vite build first');
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);

const NICHE_DESC = {
  'gold-jewelry': 'gold jewelry',
  'silver-jewelry': 'silver jewelry',
  'diamond-jewelry': 'diamond jewelry',
  'artificial-jewelry': 'artificial & imitation jewelry',
  'bridal-jewelry': 'bridal & wedding jewelry',
  'fashion-jewelry': 'fashion & costume jewelry',
};

const INTENT_PLURAL = {
  wholesaler: 'wholesalers',
  supplier: 'suppliers',
  manufacturer: 'manufacturers',
  importer: 'importers',
};

const WHATSAPP_NUMBER = process.env.VITE_WHATSAPP_NUMBER || '919999999999';

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function waLink(niche, intent, location) {
  const nd = NICHE_DESC[niche] ?? niche;
  const msg = `Hello, I need a verified ${nd} ${intent} in ${location}. Please share your catalogue.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function renderPage(page, relatedCity, relatedState) {
  const nd = NICHE_DESC[page.niche_key] ?? page.niche_key;
  const ip = INTENT_PLURAL[page.intent_type] ?? `${page.intent_type}s`;
  const location = page.target_city ?? page.target_state;
  const waUrl = waLink(page.niche_key, page.intent_type, location);
  const canonicalUrl = `${BASE_URL}/${page.slug}`;
  const statePage = `${page.niche_key}-${page.intent_type}-${page.state_slug}`;

  const relatedCityLinks = relatedCity.map(r =>
    `<a href="${BASE_URL}/${escHtml(r.slug)}">${escHtml(r.title.split('|')[0].trim())}</a>`
  ).join('\n          ');

  const relatedStateLinks = relatedState.map(r =>
    `<a href="${BASE_URL}/${escHtml(r.slug)}">${escHtml(r.title.split('|')[0].trim())}</a>`
  ).join('\n          ');

  const intentLinks = ['wholesaler', 'supplier', 'manufacturer', 'importer'].map(intent => {
    const locationSlug = page.slug.substring(page.niche_key.length + 1 + page.intent_type.length + 1);
    const targetSlug = `${page.niche_key}-${intent}-${locationSlug}`;
    const active = intent === page.intent_type ? ' class="active"' : '';
    return `<a href="${BASE_URL}/${escHtml(targetSlug)}"${active}>${intent}s</a>`;
  }).join('\n          ');

  const metaDesc = `Find verified ${nd} ${ip} in ${escHtml(location)}. B2B wholesale directory for Indian jewelry trade. Direct WhatsApp contact, bulk pricing, flexible MOQ.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(page.title)}</title>
  <meta name="description" content="${escHtml(metaDesc)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${escHtml(page.title)}">
  <meta property="og:description" content="${escHtml(metaDesc)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,sans-serif;background:#faf8f4;color:#1c1917;line-height:1.6}
    a{color:#8a6a1a;text-decoration:none}a:hover{text-decoration:underline}
    header{background:#fff;border-bottom:1px solid #e7e0d4;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
    .logo{font-family:Georgia,serif;font-size:1.5rem;font-weight:700;color:#8a6a1a}
    .wa-btn{display:inline-flex;align-items:center;gap:.5rem;background:#25D366;color:#fff;font-weight:700;border-radius:.75rem;padding:.5rem 1rem;font-size:.875rem}
    nav.breadcrumb{background:#f5f0e8;border-bottom:1px solid #e7e0d4;padding:.5rem 1.5rem;font-size:.75rem;color:#78716c;display:flex;gap:.5rem;flex-wrap:wrap}
    main{max-width:1024px;margin:0 auto;padding:2.5rem 1.5rem;display:grid;grid-template-columns:1fr 280px;gap:2rem}
    @media(max-width:768px){main{grid-template-columns:1fr}}
    .badge{display:inline-flex;align-items:center;gap:.375rem;font-size:.75rem;font-weight:600;background:rgba(138,106,26,.1);color:#8a6a1a;padding:.25rem .75rem;border-radius:9999px}
    h1{font-family:Georgia,serif;font-size:2rem;font-weight:700;margin:.75rem 0 .75rem;line-height:1.25}
    .lead{color:#57534e;font-size:.9375rem;margin-bottom:1.5rem}
    .trust-badges{display:flex;flex-wrap:wrap;gap:.625rem;margin-bottom:2rem}
    .cta-box{background:rgba(37,211,102,.06);border:1px solid rgba(37,211,102,.3);border-radius:1rem;padding:1.5rem;margin-bottom:2rem}
    .cta-box h2{font-size:1.0625rem;font-weight:600;margin-bottom:.375rem}
    .cta-box p{font-size:.875rem;color:#78716c;margin-bottom:1rem}
    .wa-cta{display:inline-flex;align-items:center;gap:.625rem;background:#25D366;color:#fff;font-weight:700;border-radius:.75rem;padding:.75rem 1.5rem;font-size:1rem}
    h2.section-h{font-family:Georgia,serif;font-size:1.25rem;font-weight:700;margin-bottom:.75rem;margin-top:2rem}
    .content-body p{color:#57534e;font-size:.9375rem;margin-bottom:.875rem}
    .checklist{list-style:none;display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.5rem}
    .checklist li{display:flex;gap:.625rem;font-size:.875rem;color:#57534e}
    .checklist li::before{content:"✓";color:#8a6a1a;font-weight:700;flex-shrink:0}
    .related-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem;margin-bottom:1.5rem}
    @media(min-width:480px){.related-grid{grid-template-columns:repeat(4,1fr)}}
    .related-grid a{font-size:.75rem;color:#78716c;border:1px solid #e7e0d4;border-radius:.5rem;padding:.5rem .75rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}
    .related-grid a:hover{color:#8a6a1a;background:#f5f0e8}
    .section-label{font-size:.6875rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a8a29e;margin-bottom:.75rem}
    aside .cta-card{background:#8a6a1a;color:#fff;border-radius:1rem;padding:1.5rem;box-shadow:0 4px 16px rgba(138,106,26,.2);margin-bottom:1rem}
    aside .cta-card h3{font-family:Georgia,serif;font-size:1.25rem;font-weight:700;margin-bottom:.5rem}
    aside .cta-card p{font-size:.875rem;opacity:.9;margin-bottom:1rem}
    aside .cta-card a{display:flex;align-items:center;justify-content:center;gap:.5rem;background:#fff;color:#8a6a1a;font-weight:700;padding:.75rem 1rem;border-radius:.75rem;font-size:.875rem;text-align:center}
    .info-card{background:#fff;border:1px solid #e7e0d4;border-radius:.75rem;padding:1.25rem;margin-bottom:1rem;font-size:.875rem}
    .info-card h4{font-size:.6875rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a8a29e;margin-bottom:.75rem}
    .info-row{display:flex;justify-content:space-between;padding:.25rem 0}
    .info-row span:first-child{color:#78716c}
    .info-row span:last-child{font-weight:500}
    .intent-card{background:#fff;border:1px solid #e7e0d4;border-radius:.75rem;padding:1.25rem;margin-bottom:1rem}
    .intent-card h4{font-size:.6875rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a8a29e;margin-bottom:.75rem}
    .intent-card a{display:block;padding:.5rem .75rem;border-radius:.5rem;font-size:.875rem;color:#78716c;margin-bottom:.25rem;text-transform:capitalize}
    .intent-card a:hover{background:#f5f0e8;color:#8a6a1a;text-decoration:none}
    .intent-card a.active{background:rgba(138,106,26,.1);color:#8a6a1a;font-weight:600}
    footer{background:#fff;border-top:1px solid #e7e0d4;padding:2rem 1.5rem;margin-top:2rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;font-size:.75rem;color:#a8a29e}
    footer .logo{font-size:1.125rem}
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "${escHtml(page.h1_heading)}",
    "description": "${escHtml(metaDesc)}",
    "url": "${canonicalUrl}",
    "areaServed": "${escHtml(location)}",
    "address": { "@type": "PostalAddress", "addressLocality": "${escHtml(location)}", "addressCountry": "IN" },
    "contactPoint": { "@type": "ContactPoint", "contactType": "sales", "availableLanguage": ["English", "Hindi"] }
  }
  </script>
</head>
<body>
  <header>
    <a class="logo" href="${BASE_URL}">Ornament</a>
    <a class="wa-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Connect on WhatsApp
    </a>
  </header>

  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a>
    <span>/</span>
    <a href="${BASE_URL}/${escHtml(statePage)}">${escHtml(page.target_state)}</a>
    ${page.target_city ? `<span>/</span><span>${escHtml(page.target_city)}</span>` : ''}
    <span>/</span>
    <span>${escHtml(nd)}</span>
  </nav>

  <main>
    <div class="content-body">
      <span class="badge">&#x25CE; ${escHtml(page.region)} India</span>
      <h1>${escHtml(page.h1_heading)}</h1>
      <p class="lead">Looking for a reliable <strong>${escHtml(nd)} ${page.intent_type}</strong> in <strong>${escHtml(location)}</strong>? Connect directly with verified B2B partners who offer bulk pricing, quality assurance, and fast dispatch.</p>

      <div class="trust-badges">
        <span class="badge">&#x2713; Verified B2B</span>
        <span class="badge">&#x2713; Quality Assured</span>
        <span class="badge">&#x2713; Bulk Pricing</span>
        <span class="badge">&#x2713; Wholesale Rates</span>
      </div>

      <div class="cta-box">
        <h2>Connect with ${escHtml(nd)} ${ip} in ${escHtml(location)}</h2>
        <p>Send your requirements on WhatsApp — get catalogue, MOQ, and pricing within minutes.</p>
        <a class="wa-cta" href="${waUrl}" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Connect on WhatsApp
        </a>
      </div>

      <h2 class="section-h">Why Source ${nd.charAt(0).toUpperCase() + nd.slice(1)} from ${escHtml(location)}?</h2>
      <p>${escHtml(location)} is a well-established hub for B2B ${escHtml(nd)} ${ip} in the ${escHtml(page.region)} India region. Retailers, boutiques, and traders across the country source ${escHtml(nd)} from ${escHtml(location)} for competitive pricing, diverse designs, and reliable supply chains.</p>
      <p>Whether you're placing a one-time bulk order or establishing a long-term wholesale relationship, our verified ${escHtml(nd)} ${ip} in ${escHtml(location)} offer flexible MOQs, customisation options, and both branded and unbranded collections.</p>

      <h2 class="section-h">What to Expect from ${escHtml(nd)} ${ip.charAt(0).toUpperCase() + ip.slice(1)} in ${escHtml(location)}</h2>
      <ul class="checklist">
        <li>Direct factory or importer pricing — no middlemen</li>
        <li>Wide range of designs including traditional, contemporary, and fusion styles</li>
        <li>Flexible minimum order quantities (MOQ) for all business sizes</li>
        <li>Pan-India shipping and B2B invoice support for GST-registered buyers</li>
        <li>WhatsApp-first communication for fast quotations and sample requests</li>
      </ul>

      ${relatedCity.length > 0 ? `
      <p class="section-label">Also Available in Nearby Cities</p>
      <div class="related-grid">${relatedCityLinks}</div>` : ''}

      ${relatedState.length > 0 ? `
      <p class="section-label">Browse by State</p>
      <div class="related-grid">${relatedStateLinks}</div>` : ''}

      <a href="${BASE_URL}" style="display:inline-flex;align-items:center;gap:.5rem;font-size:.875rem;color:#78716c;margin-top:1rem">&larr; Back to Home</a>
    </div>

    <aside>
      <div class="cta-card">
        <h3>Source ${nd.charAt(0).toUpperCase() + nd.slice(1)} in ${escHtml(location)}</h3>
        <p>Talk to verified ${ip} now. Free consultation.</p>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp Now
        </a>
      </div>

      <div class="info-card">
        <h4>Page Details</h4>
        <div class="info-row"><span>Category</span><span>${escHtml(nd)}</span></div>
        <div class="info-row"><span>Type</span><span>${escHtml(page.intent_type)}</span></div>
        <div class="info-row"><span>Location</span><span>${escHtml(location)}</span></div>
        <div class="info-row"><span>State</span><span>${escHtml(page.target_state)}</span></div>
        <div class="info-row"><span>Region</span><span>${escHtml(page.region)}</span></div>
      </div>

      <div class="intent-card">
        <h4>Looking For</h4>
        ${intentLinks}
      </div>
    </aside>
  </main>

  <footer>
    <a class="logo" href="${BASE_URL}">Ornament</a>
    <p>India's B2B Jewelry Wholesale Directory — Connecting Buyers &amp; Sellers</p>
    <p>&copy; 2024 Ornament. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

// ─── QUERY ALL PAGES ──────────────────────────────────────────────────────

const pages = db.prepare(`SELECT * FROM programmatic_pages ORDER BY region, slug`).all();
console.log(`Generating HTML for ${pages.length} pages…`);

const relatedCityStmt = db.prepare(`
  SELECT slug, title, h1_heading FROM programmatic_pages
  WHERE niche_key = ? AND intent_type = ? AND page_type = 'city' AND target_state = ? AND slug != ?
  LIMIT 8
`);
const relatedStateStmt = db.prepare(`
  SELECT slug, title, h1_heading FROM programmatic_pages
  WHERE niche_key = ? AND intent_type = ? AND page_type = 'state' AND slug != ?
  LIMIT 4
`);

// ─── SITEMAP ─────────────────────────────────────────────────────────────

const REGIONS = ['North', 'South', 'West', 'East', 'Central', 'North-East'];
const regionSlugs = {
  'North': 'north', 'South': 'south', 'West': 'west',
  'East': 'east', 'Central': 'central', 'North-East': 'northeast',
};

const sitemapBuckets = {};
for (const r of REGIONS) sitemapBuckets[r] = [];

let generated = 0;

for (const page of pages) {
  const relCity = relatedCityStmt.all(page.niche_key, page.intent_type, page.target_state, page.slug);
  const relState = relatedStateStmt.all(page.niche_key, page.intent_type, page.slug);

  const html = renderPage(page, relCity, relState);
  const pageDir = path.join(OUT_DIR, page.slug);
  mkdirSync(pageDir, { recursive: true });
  writeFileSync(path.join(pageDir, 'index.html'), html, 'utf-8');

  sitemapBuckets[page.region].push(page.slug);
  generated++;
  if (generated % 500 === 0) console.log(`  … ${generated}/${pages.length}`);
}

console.log(`✅ Generated ${generated} HTML pages.`);

// Write regional sitemaps
const today = new Date().toISOString().split('T')[0];
for (const region of REGIONS) {
  const slugs = sitemapBuckets[region];
  const urls = slugs.map(slug => `
  <url>
    <loc>${BASE_URL}/${slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>${urls}
</urlset>`;
  const fname = `sitemap-${regionSlugs[region]}.xml`;
  writeFileSync(path.join(OUT_DIR, fname), xml, 'utf-8');
  console.log(`  sitemap ${fname} — ${slugs.length} URLs`);
}

// Write sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${REGIONS.map(r => `  <sitemap>
    <loc>${BASE_URL}/sitemap-${regionSlugs[r]}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
writeFileSync(path.join(OUT_DIR, 'sitemap-index.xml'), sitemapIndex, 'utf-8');
console.log('✅ sitemap-index.xml written.');

db.close();
console.log('\n🎉 SSG complete.');
