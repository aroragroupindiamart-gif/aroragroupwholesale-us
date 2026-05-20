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
import { FOUNDER_VIDEO_ID, REVIEWS, INSTAGRAM_URL, YOUTUBE_URL, FACEBOOK_URL } from '../src/lib/brandConstants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'dist', 'public');
// Sitemaps go to public/ so they are committed as static assets and served
// by Vite in dev mode. Vite copies public/ → dist/ at build time so they
// are also accessible in the deployed app at /sitemap.xml.
const SITEMAP_DIR = path.join(__dirname, '..', 'public');
const BASE_URL = 'https://www.aroragroupwholesale.com';
const BRAND_NAME = 'Arora Group Wholesale';
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

const WHATSAPP_NUMBER = (process.env.VITE_WHATSAPP_NUMBER ?? '919999999999').replace(/\D/g, '');

const NICHE_DESC: Record<string, string> = {
  'korean-jewellery': 'Korean Jewellery',
  'fashion-jewellery': 'Fashion Jewellery',
  'anti-tarnish-jewellery': 'Anti Tarnish Jewellery',
  '18k-gold-plated-jewellery': '18k Gold Plated Jewellery',
  'demi-fine-jewellery': 'Demi Fine Jewellery',
  'western-jewellery': 'Western Jewellery',
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

function waLink(niche: string, _intent: string, location: string): string {
  const nd = NICHE_DESC[niche] ?? niche;
  const msg = `Hi Arora Group Wholesale, I am a boutique owner. Send me your latest catalog of trending ${nd} for my store in ${location}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const WA_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const SHARED_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;background:#FFF8F0;color:#1E1E1E;line-height:1.6}
a{color:#1E1E1E;text-decoration:none}a:hover{text-decoration:underline}
.top-banner{background:#1E1E1E;color:#FFC629;text-align:center;font-size:.8125rem;font-weight:600;padding:.625rem 1.5rem}
header{background:#fff;border-bottom:1px solid #e8dcc8;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.logo{font-family:Georgia,serif;font-size:1.25rem;font-weight:700;color:#1E1E1E}.logo span{color:#FFC629}
.wa-btn{display:inline-flex;align-items:center;gap:.5rem;background:#FFC629;color:#1E1E1E;font-weight:700;border-radius:.5rem;padding:.5rem 1rem;font-size:.875rem;text-decoration:none}
footer{background:#1E1E1E;border-top:1px solid #333;padding:2rem 1.5rem;margin-top:2rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;font-size:.75rem;color:#888}
footer .logo{font-size:1.125rem;color:#FFC629}
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
  const metaDesc = `${BRAND_NAME} — Direct ${nd} ${ip} serving ${esc(location)}. Premium imported, Pinterest-trending designs with certified purity, insured logistics, and low MOV ₹3,000 — no item-level MOQ.`;

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

  const reviewStripHtml = '<div style="margin-bottom:1.75rem">'
    + '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.875rem">'
    + '<span style="color:#FFC629;letter-spacing:.1em">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'
    + '<span style="font-size:.875rem;font-weight:700;color:#1E1E1E">5.0 on Google</span>'
    + '<span style="font-size:.75rem;color:#999">&nbsp;&middot;&nbsp;10 reviews</span>'
    + '</div>'
    + Array.from(REVIEWS).slice(0, 3).map(r =>
        '<div style="background:#fff;border:1px solid #e8dcc8;border-radius:.75rem;padding:.75rem 1rem;margin-bottom:.5rem;display:flex;gap:.75rem;align-items:flex-start">'
        + '<span style="color:#FFC629;font-size:.75rem;flex-shrink:0;margin-top:.125rem;letter-spacing:.05em">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'
        + '<div><p style="font-size:.8125rem;color:#555;font-style:italic;margin-bottom:.25rem">&ldquo;' + esc(r.text) + '&rdquo;</p>'
        + '<p style="font-size:.75rem;font-weight:600;color:#1E1E1E">&mdash; ' + esc(r.name) + ' &middot; ' + esc(r.role) + '</p></div>'
        + '</div>'
      ).join('')
    + '</div>';

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
    nav.breadcrumb{background:#fef3e2;border-bottom:1px solid #e8dcc8;padding:.5rem 1.5rem;font-size:.75rem;color:#666;display:flex;gap:.5rem;flex-wrap:wrap}
    main{max-width:1024px;margin:0 auto;padding:2.5rem 1.5rem;display:grid;grid-template-columns:1fr 280px;gap:2rem}
    @media(max-width:768px){main{grid-template-columns:1fr}}
    .badge{display:inline-flex;align-items:center;gap:.375rem;font-size:.75rem;font-weight:600;background:rgba(255,198,41,.15);color:#1E1E1E;padding:.25rem .75rem;border-radius:9999px;border:1px solid rgba(255,198,41,.4)}
    h1{font-family:Georgia,serif;font-size:2rem;font-weight:700;margin:.75rem 0 .75rem;line-height:1.25;color:#1E1E1E}
    .lead{color:#444;font-size:.9375rem;margin-bottom:1.5rem}
    .trust-badges{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:2rem}
    .trust-badge{display:flex;align-items:flex-start;gap:.625rem;background:#fff;border:1px solid #e8dcc8;border-radius:.75rem;padding:.875rem;font-size:.75rem;font-weight:600;color:#1E1E1E}
    .cta-box{background:rgba(255,198,41,.08);border:1px solid #FFC629;border-radius:1rem;padding:1.5rem;margin-bottom:2rem}
    .cta-box h2{font-size:1.0625rem;font-weight:600;margin-bottom:.375rem;color:#1E1E1E}
    .cta-box p{font-size:.875rem;color:#555;margin-bottom:1rem}
    .wa-cta{display:inline-flex;align-items:center;gap:.625rem;background:#FFC629;color:#1E1E1E;font-weight:700;border-radius:.75rem;padding:.75rem 1.5rem;font-size:1rem;text-decoration:none}
    h2.section-h{font-family:Georgia,serif;font-size:1.25rem;font-weight:700;margin-bottom:.75rem;margin-top:2rem;color:#1E1E1E}
    .content-body p{color:#444;font-size:.9375rem;margin-bottom:.875rem}
    details{background:#fff;border:1px solid #e8dcc8;border-radius:.75rem;margin-bottom:.5rem;overflow:hidden}
    summary{padding:1rem 1.25rem;font-weight:600;font-size:.875rem;cursor:pointer;list-style:none;color:#1E1E1E}
    details p{padding:.75rem 1.25rem 1.25rem;font-size:.875rem;color:#555;border-top:1px solid #f0e8d8}
    .related-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem;margin-bottom:1.5rem}
    @media(min-width:480px){.related-grid{grid-template-columns:repeat(4,1fr)}}
    .related-grid a{font-size:.75rem;color:#555;border:1px solid #e8dcc8;border-radius:.5rem;padding:.5rem .75rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}
    .related-grid a:hover{color:#1E1E1E;background:#fef3e2}
    .section-label{font-size:.6875rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#999;margin-bottom:.75rem}
    aside .cta-card{background:#1E1E1E;color:#fff;border-radius:1rem;padding:1.5rem;margin-bottom:1rem}
    aside .cta-card h3{font-family:Georgia,serif;font-size:1.125rem;font-weight:700;margin-bottom:.375rem;color:#FFC629}
    aside .cta-card p{font-size:.875rem;opacity:.7;margin-bottom:1rem}
    aside .cta-card a{display:flex;align-items:center;justify-content:center;gap:.5rem;background:#FFC629;color:#1E1E1E;font-weight:700;padding:.75rem 1rem;border-radius:.75rem;font-size:.875rem;text-align:center;text-decoration:none}
    .info-card{background:#fff;border:1px solid #e8dcc8;border-radius:.75rem;padding:1.25rem;margin-bottom:1rem;font-size:.875rem}
    .info-card h4{font-size:.6875rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#999;margin-bottom:.75rem}
    .info-row{display:flex;justify-content:space-between;padding:.25rem 0;font-size:.8125rem}
    .info-row span:first-child{color:#666}
    .info-row span:last-child{font-weight:600}
  </style>
  <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WholesaleStore","name":BRAND_NAME,"description":metaDesc,"url":canonicalUrl,"telephone":"+"+WHATSAPP_NUMBER,"areaServed":location,"address":{"@type":"PostalAddress","addressLocality":location,"addressCountry":"IN"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":BASE_URL},{"@type":"ListItem","position":2,"name":page.target_state,"item":BASE_URL+"/"+statePage}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is the minimum order value?","acceptedAnswer":{"@type":"Answer","text":"The minimum order value (MOV) for "+BRAND_NAME+" wholesale supply is ₹3,000 per invoice, with no item-level MOQ — mix and match any designs freely."}}]}]})}</script>
</head>
<body>
  <div class="top-banner">🔥 Source the Season's Most Viral Jewelry Designs Direct-from-Factory to ${esc(location)}</div>
  <header>
    <a class="logo" href="${BASE_URL}"><span>Arora</span> Group Wholesale</a>
    <a class="wa-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer">${WA_ICON} WhatsApp Inquiry</a>
  </header>
  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a><span>/</span>
    <a href="${BASE_URL}/${esc(statePage)}">${esc(page.target_state)}</a>
    ${page.target_city ? `<span>/</span><span>${esc(page.target_city)}</span>` : ''}
    <span>/</span><span>${esc(nd)}</span>
  </nav>
  <main>
    <div class="content-body">
      <span class="badge">&#x25CE; ${esc(page.region)} India · Direct Premium Importer</span>
      <h1>${esc(page.h1_heading)}</h1>
      <p class="lead">${esc(BRAND_NAME)} is the <strong>Direct Importer &amp; Trend Wholesaler</strong> for <strong>${esc(nd)}</strong> serving boutique owners and retailers in <strong>${esc(location)}</strong>. Skip outdated stock — source globally-imported, Pinterest-trending designs with certified purity, insured freight, and a low MOV of ₹3,000 with no item-level restrictions.</p>
      <h2 class="section-h">See the Collection — Watch the Founder Showcase</h2>
      <p style="font-size:.875rem;color:#666;margin-bottom:.875rem">${esc(BRAND_NAME)}'s founder walks through the full ${esc(nd)} range available for wholesale to ${esc(location)} boutiques.</p>
      <div style="position:relative;padding-bottom:56.25%;border-radius:.75rem;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.12);margin-bottom:2rem">
        <iframe loading="lazy" src="https://www.youtube.com/embed/${FOUNDER_VIDEO_ID}" title="${esc(BRAND_NAME)} — ${esc(nd)} Founder Showcase" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>
      </div>
      ${reviewStripHtml}
      <div class="trust-badges">
        <div class="trust-badge">🌐 Direct Global Importing (No Middlemen)</div>
        <div class="trust-badge">💧 100% Tarnish-Free Guarantee</div>
        <div class="trust-badge">📈 Pinterest &amp; Reel Trending</div>
        <div class="trust-badge">🛒 Flexible Small-Batch Sourcing — MOV ₹3,000</div>
      </div>
      <div class="cta-box">
        <h2>Inquire About ${esc(nd)} — Direct from Our Factory to ${esc(location)}</h2>
        <p>WhatsApp us your business requirements — get MOV, purity certificate, and a custom catalogue within 4 hours.</p>
        <a class="wa-cta" href="${waUrl}" target="_blank" rel="noopener noreferrer">${WA_ICON} WhatsApp ${esc(BRAND_NAME)}</a>
      </div>
      <h2 class="section-h">Trend-Dominant ${esc(nd)} for ${esc(location)} Boutiques — Designs That Sell Out Fast</h2>
      <p><strong>${esc(BRAND_NAME)}</strong> is the direct importer and trend scout supplying ${esc(location)}'s most forward-thinking boutiques with <strong>Pinterest-famous aesthetics, trending Korean styles, and waterproof anti-tarnish pieces that sell out instantly.</strong> Every collection is engineered for maximum retail turnover — helping boutique owners cash in on fast-moving social media jewelry trends before they fade.</p>
      <p>We update our ${esc(nd)} catalogue rapidly so your shelves stay stocked with fresh, highly shareable items your customers are already searching for. <strong>${esc(BRAND_NAME)}</strong> offers a <strong>Minimum Order Value of just ₹3,000 with no item-level MOQ</strong> — mix and match any designs freely. Scalable <strong>customisation and co-branding options</strong> available for established wholesale accounts across ${esc(page.target_state)}.</p>
      <h2 class="section-h">Wholesale FAQ — ${esc(nd)} from ${esc(BRAND_NAME)}</h2>
      <details><summary>What are the corporate purchasing terms?</summary><p>${esc(BRAND_NAME)} operates as a direct importer and trend wholesaler. Orders are processed against GST-registered business invoices with a Minimum Order Value (MOV) of ₹3,000 — with no item-level MOQ restrictions, so you can mix and match any designs freely. Payment terms include advance, 50/50, or credit terms for established wholesale accounts.</p></details>
      <details><summary>What metal purity certifications are provided?</summary><p>Every ${esc(nd)} piece carries certified metallic purity documentation. Anti-tarnish collections include a BIS-aligned coating verification, while gold-plated lines are tested for micron thickness. All certificates are issued per batch.</p></details>
      <details><summary>Can ${esc(BRAND_NAME)} handle custom wholesale design processing?</summary><p>Yes. Our design manufacturing wing accepts custom briefs, buyer-provided sketches, and OEM requests. Minimum custom order runs start at 50 pieces per SKU. Design-to-delivery lead time is 15–25 business days.</p></details>
      <details><summary>How does ${esc(BRAND_NAME)} handle logistics and insurance to ${esc(location)}?</summary><p>All shipments to ${esc(location)} are dispatched via <strong>fully insured transit insurance</strong> air freight or tracked surface courier. Packages include transit insurance up to invoice value, dispatched via <strong>BlueDart, Delhivery, and Ecom Express</strong>. Standard delivery timelines are <strong>3–7 working days</strong> from dispatch. All orders include a <strong>GST-compliant B2B invoice</strong>.</p></details>
      <details><summary>What is the minimum order value and how do I place an inquiry?</summary><p>The Minimum Order Value (MOV) is just ₹3,000 per invoice — with zero item-level MOQ, freely mix and match rings, anklets, necklaces, or any category. WhatsApp us your business name, GST number, required category, and quantity. Our team will respond within 4 business hours with a catalogue and price list.</p></details>
      ${page.related_city_pages.length > 0 ? `<p class="section-label" style="margin-top:1.5rem">${esc(nd)} Supply in Nearby Cities</p><div class="related-grid">${relatedCityLinks}</div>` : ''}
      <a href="${BASE_URL}" style="display:inline-flex;align-items:center;gap:.5rem;font-size:.875rem;color:#666;margin-top:1rem">&larr; Back to ${esc(BRAND_NAME)}</a>
    </div>
    <aside>
      <div class="cta-card">
        <h3>${esc(nd)} — ${esc(location)}</h3>
        <p>Direct premium import supply. MOV ₹3,000. No item MOQ. GST invoice included.</p>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer">${WA_ICON} WhatsApp Arora Group</a>
      </div>
      <div class="info-card">
        <h4>Supply Details</h4>
        <div class="info-row"><span>Product Line</span><span>${esc(nd)}</span></div>
        <div class="info-row"><span>Role</span><span>${esc(page.intent_type)}</span></div>
        <div class="info-row"><span>Serving</span><span>${esc(location)}</span></div>
        <div class="info-row"><span>State</span><span>${esc(page.target_state)}</span></div>
        <div class="info-row"><span>MOV</span><span>₹3,000</span></div>
      </div>
    </aside>
  </main>
  <footer style="display:block;padding:2rem 1.5rem">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1.5rem;margin-bottom:1.25rem">
      <div>
        <a class="logo" href="${BASE_URL}">${esc(BRAND_NAME)}</a>
        <p style="margin-top:.375rem;font-size:.75rem;color:#888">Direct Premium Importer &amp; Trend Wholesaler Across India</p>
      </div>
      <div>
        <p style="font-size:.625rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#555;margin-bottom:.5rem">Company</p>
        <div style="display:flex;flex-direction:column;gap:.375rem">
          <a href="${BASE_URL}/about" style="color:#aaa;text-decoration:none;font-size:.75rem">About Us</a>
          <a href="${BASE_URL}/contact" style="color:#aaa;text-decoration:none;font-size:.75rem">Contact Us</a>
        </div>
      </div>
      <div>
        <p style="font-size:.625rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#555;margin-bottom:.5rem">Follow Us</p>
        <div style="display:flex;gap:.875rem;align-items:center">
          <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" style="color:#aaa" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          <a href="${YOUTUBE_URL}" target="_blank" rel="noopener noreferrer" style="color:#aaa" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
          <a href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" style="color:#aaa" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid #444;padding-top:.875rem">
      <p style="color:#888;font-size:.75rem">&copy; 2025 ${esc(BRAND_NAME)}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
}

// ── Homepage pre-render ────────────────────────────────────────────────────

function renderHomepageContent(): string {
  const niches = getAllNiches();
  const states = getAllStates();
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Arora Group Wholesale, I am a boutique owner. Send me your latest catalog of trending jewelry for my store.")}`;

  const nicheCards = niches.map(n => {
    const href = `${BASE_URL}/${n.niche_key}-wholesaler-new-delhi`;
    return `<a href="${href}" style="display:flex;flex-direction:column;gap:.5rem;padding:1.5rem;background:#fff;border:1px solid #e8dcc8;border-radius:.75rem;text-decoration:none;color:inherit">
      <span style="font-family:Georgia,serif;font-size:1rem;font-weight:700;color:#1E1E1E">${esc(n.display_name)}</span>
      <span style="font-size:.8125rem;color:#666">Wholesalers · Suppliers · Manufacturers</span>
      <span style="font-size:.75rem;color:#FFC629;margin-top:auto;font-weight:700">Browse &rarr;</span>
    </a>`;
  }).join('\n');

  const statesByRegion = REGION_ORDER.map(region => ({
    region,
    states: states.filter(s => s.region === region),
  })).filter(g => g.states.length > 0);

  const stateGrid = statesByRegion.map(g => {
    const links = g.states.map(s =>
      `<a href="${BASE_URL}/korean-jewellery-wholesaler-${s.state_slug}" style="font-size:.8125rem;color:#444;padding:.375rem .625rem;background:#fff;border:1px solid #e8dcc8;border-radius:.5rem;text-decoration:none">${esc(s.state_name)}</a>`
    ).join('\n      ');
    return `<div style="margin-bottom:1.5rem">
      <h3 style="font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#FFC629;background:#1E1E1E;display:inline-block;padding:.125rem .5rem;border-radius:.25rem;margin-bottom:.75rem">${esc(g.region)} India</h3>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem">${links}</div>
    </div>`;
  }).join('\n');

  const reviewsGridHtml = Array.from(REVIEWS).map(r =>
    '<div style="background:#fff;border:1px solid #e8dcc8;border-radius:.75rem;padding:1.25rem;display:flex;flex-direction:column;gap:.75rem">'
    + '<span style="color:#FFC629;letter-spacing:.08em;font-size:.875rem">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'
    + '<p style="font-size:.875rem;color:#555;font-style:italic;flex:1">&ldquo;' + esc(r.text) + '&rdquo;</p>'
    + '<div><p style="font-size:.875rem;font-weight:600;color:#1E1E1E">' + esc(r.name) + '</p>'
    + '<p style="font-size:.75rem;color:#999">' + esc(r.role) + '</p></div>'
    + '</div>'
  ).join('\n        ');

  return `<div style="min-height:100vh;background:#FFF8F0;font-family:system-ui,sans-serif">
  <div style="background:#1E1E1E;color:#FFC629;text-align:center;font-size:.8125rem;font-weight:600;padding:.625rem 1.5rem">🔥 Source the Season's Most Viral Jewelry Designs Direct-from-Factory Across India — Minimum Order Value: ₹3,000</div>
  <header style="background:#fff;border-bottom:1px solid #e8dcc8;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50">
    <a href="${BASE_URL}" style="font-family:Georgia,serif;font-size:1.25rem;font-weight:700;color:#1E1E1E;text-decoration:none"><span style="color:#FFC629">Arora</span> Group Wholesale</a>
    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.5rem;background:#FFC629;color:#1E1E1E;font-weight:700;border-radius:.5rem;padding:.5rem 1rem;font-size:.875rem;text-decoration:none">${WA_ICON} WhatsApp Inquiry</a>
  </header>

  <section style="background:linear-gradient(to bottom right,#fef3e2,#FFF8F0);padding:4rem 1.5rem;text-align:center;border-bottom:1px solid #e8dcc8">
    <div style="max-width:800px;margin:0 auto">
      <span style="display:inline-block;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#1E1E1E;background:rgba(255,198,41,.2);border:1px solid rgba(255,198,41,.4);padding:.25rem .75rem;border-radius:9999px;margin-bottom:1rem">Direct Importer &amp; Wholesaler · Pan-India</span>
      <h1 style="font-family:Georgia,serif;font-size:2.5rem;font-weight:700;color:#1E1E1E;line-height:1.25;margin-bottom:1.5rem">${esc(BRAND_NAME)}: <span style="color:#FFC629">Viral, Trend-Driven</span> Jewelry Supply Across India</h1>
      <p style="font-size:1.0625rem;color:#444;max-width:640px;margin:0 auto 2rem">We are India's direct premium importer and trend scout for fast-selling jewelry. From viral Instagram aesthetics to high-demand Pinterest styles, we source and supply retail brands and online sellers in every major city with globally-imported, premium collections your customers are already hunting for. Skip the outdated stock — get the exact trending designs, direct to your door.</p>
      <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-bottom:2rem">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.5rem;background:#FFC629;color:#1E1E1E;font-weight:700;border-radius:.5rem;padding:.875rem 1.5rem;font-size:1rem;text-decoration:none">${WA_ICON} WhatsApp Inquiry</a>
        <a href="#product-lines" style="display:inline-flex;align-items:center;background:#fff;color:#1E1E1E;font-weight:600;border:1px solid #e8dcc8;border-radius:.5rem;padding:.875rem 1.5rem;font-size:1rem;text-decoration:none">Our Product Lines</a>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;font-size:.875rem;color:#666">
        <span>&#x2713; <strong style="color:#1E1E1E">3,792</strong> pages</span>
        <span>&#x2713; <strong style="color:#1E1E1E">122</strong> cities</span>
        <span>&#x2713; <strong style="color:#1E1E1E">36</strong> states &amp; UTs</span>
        <span>&#x2713; <strong style="color:#1E1E1E">6</strong> product lines</span>
        <span>&#x2713; MOV <strong style="color:#1E1E1E">₹3,000</strong></span>
      </div>
    </div>
  </section>

  <section style="max-width:900px;margin:0 auto;padding:3rem 1.5rem;text-align:center">
    <h2 style="font-family:Georgia,serif;font-size:1.75rem;font-weight:700;margin-bottom:.5rem;color:#1E1E1E">Meet the Founder — See the Collection Live</h2>
    <p style="color:#666;margin-bottom:1.5rem;font-size:.9375rem">Watch ${esc(BRAND_NAME)}'s founder walk through the full trending jewellery range — the same collections available for direct wholesale to your boutique.</p>
    <div style="position:relative;padding-bottom:56.25%;border-radius:.75rem;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.12)">
      <iframe loading="lazy" src="https://www.youtube.com/embed/${FOUNDER_VIDEO_ID}" title="${esc(BRAND_NAME)} — Founder Product Showcase" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>
    </div>
  </section>

  <section style="background:#FFF8F0;border-top:1px solid #e8dcc8;padding:3.5rem 1.5rem">
    <div style="max-width:1200px;margin:0 auto">
      <div style="text-align:center;margin-bottom:2rem">
        <div style="display:flex;align-items:center;justify-content:center;gap:.5rem;margin-bottom:.375rem">
          <span style="color:#FFC629;font-size:1.25rem;letter-spacing:.1em">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span style="font-family:Georgia,serif;font-size:1.375rem;font-weight:700;color:#1E1E1E">5.0</span>
        </div>
        <p style="font-size:.75rem;color:#999;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.5rem">10 Google Reviews &middot; Verified Retailers</p>
        <h2 style="font-family:Georgia,serif;font-size:1.75rem;font-weight:700;color:#1E1E1E">What Boutique Owners Say</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem">
        ${reviewsGridHtml}
      </div>
    </div>
  </section>

  <section id="product-lines" style="max-width:1200px;margin:0 auto;padding:3rem 1.5rem">
    <h2 style="font-family:Georgia,serif;font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:.5rem;color:#1E1E1E">Our 6 Specialised Product Lines</h2>
    <p style="text-align:center;color:#666;margin-bottom:2rem">Globally imported, trend-scouted collections — available for direct wholesale across India</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:3rem">
      ${nicheCards}
    </div>

    <h2 style="font-family:Georgia,serif;font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:.5rem;color:#1E1E1E">State-Level Supply Coverage</h2>
    <p style="text-align:center;color:#666;margin-bottom:2rem">${esc(BRAND_NAME)} dispatches direct to retailers across all 36 Indian states and union territories</p>
    ${stateGrid}
  </section>

  <section style="background:#1E1E1E;color:#fff;padding:4rem 1.5rem;text-align:center">
    <div style="max-width:600px;margin:0 auto">
      <h2 style="font-family:Georgia,serif;font-size:1.75rem;font-weight:700;margin-bottom:1rem">Ready to Source Direct from <span style="color:#FFC629">${esc(BRAND_NAME)}</span>?</h2>
      <p style="opacity:.7;margin-bottom:2rem">Minimum Order Value: ₹3,000 · No Item MOQ · GST Invoice · Insured Freight · Purity Certified</p>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.5rem;background:#FFC629;color:#1E1E1E;font-weight:700;border-radius:.5rem;padding:1rem 2rem;font-size:1.0625rem;text-decoration:none">${WA_ICON} WhatsApp Arora Group</a>
    </div>
  </section>

  <footer style="background:#1E1E1E;border-top:1px solid #333;padding:2.5rem 1.5rem">
    <div style="max-width:1200px;margin:0 auto">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:2rem;margin-bottom:1.5rem">
        <div>
          <a href="${BASE_URL}" style="font-family:Georgia,serif;font-size:1.125rem;font-weight:700;color:#FFC629;text-decoration:none">${esc(BRAND_NAME)}</a>
          <p style="margin-top:.375rem;font-size:.75rem;color:#ffffff80">Direct Premium Importer &amp; Trend Wholesaler Across India</p>
        </div>
        <div>
          <p style="font-size:.625rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#ffffff40;margin-bottom:.625rem">Company</p>
          <div style="display:flex;flex-direction:column;gap:.5rem">
            <a href="${BASE_URL}/about" style="color:#ffffff60;text-decoration:none;font-size:.875rem">About Us</a>
            <a href="${BASE_URL}/contact" style="color:#ffffff60;text-decoration:none;font-size:.875rem">Contact Us</a>
          </div>
        </div>
        <div>
          <p style="font-size:.625rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#ffffff40;margin-bottom:.625rem">Follow Us</p>
          <div style="display:flex;gap:1rem;align-items:center">
            <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" style="color:#ffffff50" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            <a href="${YOUTUBE_URL}" target="_blank" rel="noopener noreferrer" style="color:#ffffff50" aria-label="YouTube"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            <a href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" style="color:#ffffff50" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          </div>
        </div>
      </div>
      <div style="border-top:1px solid #ffffff15;padding-top:1rem">
        <p style="font-size:.75rem;color:#ffffff30;text-align:center">&copy; 2025 ${esc(BRAND_NAME)}. All rights reserved.</p>
      </div>
    </div>
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
    // First chunk keeps the canonical name (sitemap-north.xml);
    // overflow chunks get a numeric suffix (sitemap-north-2.xml, etc.)
    const suffix = idx === 0 ? '' : `-${idx + 1}`;
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
    writeFileSync(path.join(SITEMAP_DIR, filename), xml, 'utf-8');
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

// Write sitemap index as sitemap.xml (committed to public/, served at /sitemap.xml)
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapFiles.map(f => `  <sitemap>
    <loc>${BASE_URL}/${f}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
writeFileSync(path.join(SITEMAP_DIR, 'sitemap.xml'), sitemapIndex, 'utf-8');
console.log('✅ sitemap.xml written with', allSitemapFiles.length, 'regional sitemaps.');

console.log('\n🎉 SSG complete.');
