/**
 * Project Ornament — Static Site Generator + Sitemap Builder
 *
 * Run AFTER `vite build`:
 *   tsx scripts/generate-ssg.ts
 *
 * Imports shared DAL functions from api-server/ornamentDb.ts to avoid
 * duplicating SQL. Sets ORNAMENT_DATA_DIR so ornamentDb resolves the
 * SQLite path correctly when loaded via tsx (not compiled dist/).
 *
 * Outputs to dist/public/:
 *   {slug}/index.html        — standalone pre-rendered HTML for bots/crawlers
 *   index.html               — Vite SPA index with pre-rendered homepage injected
 *   sitemap-index.xml        — references 4 regional sitemaps (+ numeric chunks)
 *   sitemap-north[-N].xml    — North India pages (≤ 1,000 URLs/file)
 *   sitemap-south[-N].xml    — South India pages
 *   sitemap-west[-N].xml     — West India pages
 *   sitemap-east-central[-N].xml — East + Central + North-East pages
 */

import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'dist', 'public');
const BASE_URL = 'https://ornament.replit.app';
const SITEMAP_URL_CAP = 1000;

// ── Set DB path env var BEFORE dynamic-importing ornamentDb ────────────────
const dataDir = path.join(__dirname, '..', '..', 'api-server', 'data');
process.env.ORNAMENT_DATA_DIR = dataDir;

// Dynamic import so env var is set before the module's top-level code runs
const {
  getAllSlugs,
  getPageBySlug,
  getRelatedCityPages,
  getRelatedStatePages,
  getAllNiches,
  getAllStates,
} = await import('../../api-server/src/lib/ornamentDb.js');

// ── Sanity checks ──────────────────────────────────────────────────────────

if (!existsSync(path.join(dataDir, 'ornament.db'))) {
  console.error('❌ DB not found at', dataDir, '\nRun: pnpm --filter @workspace/api-server run seed');
  process.exit(1);
}
if (!existsSync(OUT_DIR)) {
  console.error('❌ dist/public not found — run vite build first');
  process.exit(1);
}

// ── Constants ──────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = process.env.VITE_WHATSAPP_NUMBER ?? '919999999999';

const NICHE_DESC: Record<string, string> = {
  'gold-jewelry': 'gold jewelry',
  'silver-jewelry': 'silver jewelry',
  'diamond-jewelry': 'diamond jewelry',
  'artificial-jewelry': 'artificial & imitation jewelry',
  'bridal-jewelry': 'bridal & wedding jewelry',
  'fashion-jewelry': 'fashion & costume jewelry',
};

const INTENT_PLURAL: Record<string, string> = {
  wholesaler: 'wholesalers',
  supplier: 'suppliers',
  manufacturer: 'manufacturers',
  importer: 'importers',
};

const REGION_ORDER = ['North', 'South', 'West', 'East', 'Central', 'North-East'];

// ── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function waLink(niche: string, intent: string, location: string): string {
  const nd = NICHE_DESC[niche] ?? niche;
  const msg = `Hello, I need a verified ${nd} ${intent} in ${location}. Please share your catalogue.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const WA_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const SHARED_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;background:#faf8f4;color:#1c1917;line-height:1.6}
a{color:#8a6a1a;text-decoration:none}a:hover{text-decoration:underline}
header{background:#fff;border-bottom:1px solid #e7e0d4;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.logo{font-family:Georgia,serif;font-size:1.5rem;font-weight:700;color:#8a6a1a}
.wa-btn{display:inline-flex;align-items:center;gap:.5rem;background:#25D366;color:#fff;font-weight:700;border-radius:.75rem;padding:.5rem 1rem;font-size:.875rem;text-decoration:none}
footer{background:#fff;border-top:1px solid #e7e0d4;padding:2rem 1.5rem;margin-top:2rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;font-size:.75rem;color:#a8a29e}
footer .logo{font-size:1.125rem}
`;

// ── Page template (slug pages) ─────────────────────────────────────────────

function renderSlugPage(page: ReturnType<typeof getPageBySlug>): string {
  if (!page) return '';
  const nd = NICHE_DESC[page.niche_key] ?? page.niche_key;
  const ip = INTENT_PLURAL[page.intent_type] ?? `${page.intent_type}s`;
  const location = page.target_city ?? page.target_state;
  const waUrl = waLink(page.niche_key, page.intent_type, location);
  const canonicalUrl = `${BASE_URL}/${page.slug}`;
  const statePage = `${page.niche_key}-${page.intent_type}-${page.state_slug}`;
  const metaDesc = `Find verified ${nd} ${ip} in ${esc(location)}. B2B wholesale directory for Indian jewelry trade. Direct WhatsApp contact, bulk pricing, flexible MOQ.`;

  const relatedCityLinks = page.related_city_pages.map(r =>
    `<a href="${BASE_URL}/${esc(r.slug)}">${esc(r.title.split('|')[0].trim())}</a>`
  ).join('\n          ');

  const relatedStateLinks = page.related_state_pages.map(r =>
    `<a href="${BASE_URL}/${esc(r.slug)}">${esc(r.title.split('|')[0].trim())}</a>`
  ).join('\n          ');

  const intentLinks = ['wholesaler', 'supplier', 'manufacturer', 'importer'].map(intent => {
    const locationSlug = page.slug.substring(page.niche_key.length + 1 + page.intent_type.length + 1);
    const targetSlug = `${page.niche_key}-${intent}-${locationSlug}`;
    const active = intent === page.intent_type ? ' class="active"' : '';
    return `<a href="${BASE_URL}/${esc(targetSlug)}"${active}>${intent}s</a>`;
  }).join('\n          ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(metaDesc)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <style>${SHARED_CSS}
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
    .wa-cta{display:inline-flex;align-items:center;gap:.625rem;background:#25D366;color:#fff;font-weight:700;border-radius:.75rem;padding:.75rem 1.5rem;font-size:1rem;text-decoration:none}
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
    aside .cta-card a{display:flex;align-items:center;justify-content:center;gap:.5rem;background:#fff;color:#8a6a1a;font-weight:700;padding:.75rem 1rem;border-radius:.75rem;font-size:.875rem;text-align:center;text-decoration:none}
    .info-card{background:#fff;border:1px solid #e7e0d4;border-radius:.75rem;padding:1.25rem;margin-bottom:1rem;font-size:.875rem}
    .info-card h4{font-size:.6875rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a8a29e;margin-bottom:.75rem}
    .info-row{display:flex;justify-content:space-between;padding:.25rem 0}
    .info-row span:first-child{color:#78716c}
    .info-row span:last-child{font-weight:500}
    .intent-card{background:#fff;border:1px solid #e7e0d4;border-radius:.75rem;padding:1.25rem;margin-bottom:1rem}
    .intent-card h4{font-size:.6875rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a8a29e;margin-bottom:.75rem}
    .intent-card a{display:block;padding:.5rem .75rem;border-radius:.5rem;font-size:.875rem;color:#78716c;margin-bottom:.25rem;text-transform:capitalize}
    .intent-card a:hover{background:#f5f0e8;color:#8a6a1a}
    .intent-card a.active{background:rgba(138,106,26,.1);color:#8a6a1a;font-weight:600}
  </style>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"${esc(page.h1_heading)}","description":"${esc(metaDesc)}","url":"${canonicalUrl}","areaServed":"${esc(location)}","address":{"@type":"PostalAddress","addressLocality":"${esc(location)}","addressCountry":"IN"}}</script>
</head>
<body>
  <header>
    <a class="logo" href="${BASE_URL}">Ornament</a>
    <a class="wa-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer">${WA_ICON} Connect on WhatsApp</a>
  </header>
  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a><span>/</span>
    <a href="${BASE_URL}/${esc(statePage)}">${esc(page.target_state)}</a>
    ${page.target_city ? `<span>/</span><span>${esc(page.target_city)}</span>` : ''}
    <span>/</span><span>${esc(nd)}</span>
  </nav>
  <main>
    <div class="content-body">
      <span class="badge">&#x25CE; ${esc(page.region)} India</span>
      <h1>${esc(page.h1_heading)}</h1>
      <p class="lead">Looking for a reliable <strong>${esc(nd)} ${page.intent_type}</strong> in <strong>${esc(location)}</strong>? Connect directly with verified B2B partners who offer bulk pricing, quality assurance, and fast dispatch.</p>
      <div class="trust-badges">
        <span class="badge">&#x2713; Verified B2B</span>
        <span class="badge">&#x2713; Quality Assured</span>
        <span class="badge">&#x2713; Bulk Pricing</span>
        <span class="badge">&#x2713; Wholesale Rates</span>
      </div>
      <div class="cta-box">
        <h2>Connect with ${esc(nd)} ${ip} in ${esc(location)}</h2>
        <p>Send your requirements on WhatsApp — get catalogue, MOQ, and pricing within minutes.</p>
        <a class="wa-cta" href="${waUrl}" target="_blank" rel="noopener noreferrer">${WA_ICON} Connect on WhatsApp</a>
      </div>
      <h2 class="section-h">Why Source ${nd.charAt(0).toUpperCase() + nd.slice(1)} from ${esc(location)}?</h2>
      <p>${esc(location)} is a well-established hub for B2B ${esc(nd)} ${ip} in the ${esc(page.region)} India region. Retailers, boutiques, and traders across the country source ${esc(nd)} from ${esc(location)} for competitive pricing, diverse designs, and reliable supply chains.</p>
      <p>Whether placing a one-time bulk order or establishing a long-term wholesale relationship, our verified ${esc(nd)} ${ip} in ${esc(location)} offer flexible MOQs, customisation options, and both branded and unbranded collections.</p>
      <h2 class="section-h">What to Expect from ${ip.charAt(0).toUpperCase() + ip.slice(1)} in ${esc(location)}</h2>
      <ul class="checklist">
        <li>Direct factory or importer pricing — no middlemen</li>
        <li>Wide range of designs: traditional, contemporary, and fusion styles</li>
        <li>Flexible minimum order quantities (MOQ) for all business sizes</li>
        <li>Pan-India shipping and B2B invoice support for GST-registered buyers</li>
        <li>WhatsApp-first communication for fast quotations and sample requests</li>
      </ul>
      ${page.related_city_pages.length > 0 ? `<p class="section-label">Also Available in Nearby Cities</p><div class="related-grid">${relatedCityLinks}</div>` : ''}
      ${page.related_state_pages.length > 0 ? `<p class="section-label">Browse by State</p><div class="related-grid">${relatedStateLinks}</div>` : ''}
      <a href="${BASE_URL}" style="display:inline-flex;align-items:center;gap:.5rem;font-size:.875rem;color:#78716c;margin-top:1rem">&larr; Back to Home</a>
    </div>
    <aside>
      <div class="cta-card">
        <h3>Source ${nd.charAt(0).toUpperCase() + nd.slice(1)} in ${esc(location)}</h3>
        <p>Talk to verified ${ip} now. Free consultation.</p>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer">${WA_ICON} WhatsApp Now</a>
      </div>
      <div class="info-card">
        <h4>Page Details</h4>
        <div class="info-row"><span>Category</span><span>${esc(nd)}</span></div>
        <div class="info-row"><span>Type</span><span>${esc(page.intent_type)}</span></div>
        <div class="info-row"><span>Location</span><span>${esc(location)}</span></div>
        <div class="info-row"><span>State</span><span>${esc(page.target_state)}</span></div>
        <div class="info-row"><span>Region</span><span>${esc(page.region)}</span></div>
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

// ── Homepage pre-render ────────────────────────────────────────────────────

function renderHomepageContent(): string {
  const niches = getAllNiches();
  const states = getAllStates();
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I'm interested in wholesale jewelry sourcing. Please guide me.")}`;

  const nicheCards = niches.map(n => {
    const href = `${BASE_URL}/${n.niche_key}-wholesaler-new-delhi`;
    return `<a href="${href}" style="display:flex;flex-direction:column;gap:.5rem;padding:1.5rem;background:#fff;border:1px solid #e7e0d4;border-radius:.75rem;text-decoration:none;color:inherit">
      <span style="font-family:Georgia,serif;font-size:1rem;font-weight:700;color:#8a6a1a">${esc(n.display_name)}</span>
      <span style="font-size:.8125rem;color:#78716c">Wholesalers · Suppliers · Manufacturers</span>
      <span style="font-size:.75rem;color:#8a6a1a;margin-top:auto">Browse &rarr;</span>
    </a>`;
  }).join('\n');

  const statesByRegion = REGION_ORDER.map(region => ({
    region,
    states: states.filter(s => s.region === region),
  })).filter(g => g.states.length > 0);

  const stateGrid = statesByRegion.map(g => {
    const links = g.states.map(s =>
      `<a href="${BASE_URL}/gold-jewelry-wholesaler-${s.state_slug}" style="font-size:.8125rem;color:#57534e;padding:.375rem .625rem;background:#fff;border:1px solid #e7e0d4;border-radius:.5rem;text-decoration:none">${esc(s.state_name)}</a>`
    ).join('\n      ');
    return `<div style="margin-bottom:1.5rem">
      <h3 style="font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a8a29e;margin-bottom:.75rem">${esc(g.region)} India</h3>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem">${links}</div>
    </div>`;
  }).join('\n');

  return `<div style="min-height:100vh;background:#faf8f4;font-family:system-ui,sans-serif">
  <header style="background:#fff;border-bottom:1px solid #e7e0d4;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50">
    <a href="${BASE_URL}" style="font-family:Georgia,serif;font-size:1.5rem;font-weight:700;color:#8a6a1a;text-decoration:none">Ornament</a>
    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.5rem;background:#25D366;color:#fff;font-weight:700;border-radius:.75rem;padding:.5rem 1rem;font-size:.875rem;text-decoration:none">${WA_ICON} Chat on WhatsApp</a>
  </header>

  <section style="background:linear-gradient(to bottom right,#fffbeb,#faf8f4);padding:4rem 1.5rem;text-align:center;border-bottom:1px solid #e7e0d4">
    <div style="max-width:800px;margin:0 auto">
      <span style="display:inline-block;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#8a6a1a;background:rgba(138,106,26,.1);padding:.25rem .75rem;border-radius:9999px;margin-bottom:1rem">B2B Wholesale Directory — India</span>
      <h1 style="font-family:Georgia,serif;font-size:2.5rem;font-weight:700;color:#1c1917;line-height:1.25;margin-bottom:1.5rem">Find Trusted Jewelry <span style="color:#8a6a1a">Wholesalers &amp; Suppliers</span> Across India</h1>
      <p style="font-size:1.0625rem;color:#57534e;max-width:600px;margin:0 auto 2rem">Connecting retailers and traders with verified B2B jewelry manufacturers, wholesalers, importers and suppliers in every major Indian city and state.</p>
      <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-bottom:2rem">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.5rem;background:#25D366;color:#fff;font-weight:700;border-radius:.75rem;padding:.875rem 1.5rem;font-size:1rem;text-decoration:none">${WA_ICON} Chat on WhatsApp</a>
        <a href="#browse" style="display:inline-flex;align-items:center;background:#fff;color:#1c1917;font-weight:600;border:1px solid #e7e0d4;border-radius:.75rem;padding:.875rem 1.5rem;font-size:1rem;text-decoration:none">Browse by Category</a>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;font-size:.875rem;color:#78716c">
        <span>&#x2713; <strong style="color:#1c1917">3,792</strong> pages</span>
        <span>&#x2713; <strong style="color:#1c1917">122</strong> cities</span>
        <span>&#x2713; <strong style="color:#1c1917">36</strong> states &amp; UTs</span>
        <span>&#x2713; <strong style="color:#1c1917">6</strong> jewelry niches</span>
      </div>
    </div>
  </section>

  <section id="browse" style="max-width:1200px;margin:0 auto;padding:3rem 1.5rem">
    <h2 style="font-family:Georgia,serif;font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:.5rem">Browse by Jewelry Category</h2>
    <p style="text-align:center;color:#78716c;margin-bottom:2rem">Select a niche to find wholesale partners across India</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:3rem">
      ${nicheCards}
    </div>

    <h2 style="font-family:Georgia,serif;font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:.5rem">Browse by State</h2>
    <p style="text-align:center;color:#78716c;margin-bottom:2rem">Find verified wholesale jewelry partners in your state</p>
    ${stateGrid}
  </section>

  <section style="background:#8a6a1a;color:#fff;padding:4rem 1.5rem;text-align:center">
    <div style="max-width:600px;margin:0 auto">
      <h2 style="font-family:Georgia,serif;font-size:1.75rem;font-weight:700;margin-bottom:1rem">Ready to Source Jewelry at Wholesale Prices?</h2>
      <p style="opacity:.9;margin-bottom:2rem">Connect with our verified B2B jewelry suppliers on WhatsApp. Get catalogues, MOQ details, and pricing within minutes.</p>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.5rem;background:#25D366;color:#fff;font-weight:700;border-radius:.75rem;padding:1rem 2rem;font-size:1.0625rem;text-decoration:none">${WA_ICON} Connect Now — It's Free</a>
    </div>
  </section>

  <footer style="background:#fff;border-top:1px solid #e7e0d4;padding:2rem 1.5rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;font-size:.75rem;color:#a8a29e">
    <a href="${BASE_URL}" style="font-family:Georgia,serif;font-size:1.125rem;font-weight:700;color:#8a6a1a;text-decoration:none">Ornament</a>
    <p>India's B2B Jewelry Wholesale Directory — Connecting Buyers &amp; Sellers</p>
    <p>&copy; 2024 Ornament. All rights reserved.</p>
  </footer>
</div>`;
}

function injectHomepagePrerender(): void {
  const viteIndexPath = path.join(OUT_DIR, 'index.html');
  if (!existsSync(viteIndexPath)) {
    console.warn('⚠ dist/public/index.html not found — skipping homepage prerender');
    return;
  }
  const html = readFileSync(viteIndexPath, 'utf-8');
  const content = renderHomepageContent();
  const injected = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${content}</div>`,
  );
  if (injected === html) {
    console.warn('⚠ Could not find <div id="root"></div> in index.html — homepage prerender skipped');
    return;
  }
  writeFileSync(viteIndexPath, injected, 'utf-8');
  console.log('✅ Homepage pre-rendered into dist/public/index.html');
}

// ── Sitemap helpers ────────────────────────────────────────────────────────

/**
 * Writes one or more sitemap XML files for a named region-bucket, capping
 * each file at SITEMAP_URL_CAP (1,000) URLs.
 * Returns the list of filenames written (e.g. ['sitemap-north.xml'] or
 * ['sitemap-north-1.xml', 'sitemap-north-2.xml']).
 */
function writeSitemapBucket(name: string, slugs: string[], today: string): string[] {
  const chunks: string[][] = [];
  for (let i = 0; i < slugs.length; i += SITEMAP_URL_CAP) {
    chunks.push(slugs.slice(i, i + SITEMAP_URL_CAP));
  }
  const filenames: string[] = [];
  chunks.forEach((chunk, idx) => {
    const suffix = chunks.length > 1 ? `-${idx + 1}` : '';
    const filename = `sitemap-${name}${suffix}.xml`;
    const urls = chunk.map(slug => `
  <url>
    <loc>${BASE_URL}/${slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
    writeFileSync(path.join(OUT_DIR, filename), xml, 'utf-8');
    filenames.push(filename);
  });
  return filenames;
}

// ── Main ──────────────────────────────────────────────────────────────────

const slugEntries = getAllSlugs();
console.log(`Generating HTML for ${slugEntries.length} pages…`);

// Sitemap 4-bucket mapping
const BUCKET_MAP: Record<string, string> = {
  North: 'north',
  South: 'south',
  West: 'west',
  East: 'east-central',
  Central: 'east-central',
  'North-East': 'east-central',
};

const buckets: Record<string, string[]> = {
  north: [], south: [], west: [], 'east-central': [],
};

let generated = 0;

for (const entry of slugEntries) {
  const page = getPageBySlug(entry.slug);
  if (!page) continue;

  const html = renderSlugPage(page);
  const pageDir = path.join(OUT_DIR, entry.slug);
  mkdirSync(pageDir, { recursive: true });
  writeFileSync(path.join(pageDir, 'index.html'), html, 'utf-8');

  const bucket = BUCKET_MAP[entry.region] ?? 'east-central';
  buckets[bucket].push(entry.slug);

  generated++;
  if (generated % 500 === 0) console.log(`  … ${generated}/${slugEntries.length}`);
}

console.log(`✅ Generated ${generated} HTML pages.`);

// ── Inject homepage pre-render ─────────────────────────────────────────────
injectHomepagePrerender();

// ── Write sitemaps ─────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
const allSitemapFiles: string[] = [];

for (const [name, slugs] of Object.entries(buckets)) {
  const files = writeSitemapBucket(name, slugs, today);
  let remaining = slugs.length;
  for (const f of files) {
    const count = Math.min(SITEMAP_URL_CAP, remaining);
    console.log(`  sitemap ${f} — ${count} URLs`);
    remaining -= count;
  }
  allSitemapFiles.push(...files);
}

// Write sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapFiles.map(f => `  <sitemap>
    <loc>${BASE_URL}/${f}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
writeFileSync(path.join(OUT_DIR, 'sitemap-index.xml'), sitemapIndex, 'utf-8');
console.log('✅ sitemap-index.xml written with', allSitemapFiles.length, 'sitemaps.');

console.log('\n🎉 SSG complete.');
