/**
 * Project Ornament — India Static Site Generator + Sitemap Builder
 *
 * Dedicated generator for Arora Group Wholesale India (https://www.aroragroupwholesale.com)
 *
 * Features:
 * - 3,792 Indian pSEO pages generated from SQLite ornament.db
 * - 4 Regional sitemaps (North, South, West, East-Central) + sitemap.xml index
 * - Indian B2B wholesale terms: ₹3,000 MOV, zero item MOQ, GST-registered invoices
 * - Fully insured logistics with BlueDart, Delhivery, Ecom Express
 */

import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { FOUNDER_VIDEO_ID, REVIEWS, INSTAGRAM_URL, YOUTUBE_URL, FACEBOOK_URL } from '../src/lib/brandConstants.js';
import { REGION_ORDER } from '../src/lib/staticData.js';
import { getMetaDescription, getFaqs } from '../../../scripts/content-spinner.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'dist', 'public');
const SITEMAP_DIR = path.join(__dirname, '..', 'public');
const BRAND_ID = 'aroragroupwholesale';
const BASE_URL = (process.env.VITE_SITE_URL || 'https://www.aroragroupwholesale.com').replace(/\/$/, '');
const BRAND_NAME = process.env.VITE_BRAND_NAME || 'Arora Group Wholesale';
const SITEMAP_URL_CAP = 1000;

// Set DB path env var BEFORE importing ornamentDb
const dataDir = path.join(__dirname, '..', '..', 'api-server', 'data');
process.env.ORNAMENT_DATA_DIR = dataDir;

const {
  getAllSlugs,
  getPageBySlug,
  getAllNiches,
  getAllStates,
  getAllCities,
} = await import('../../api-server/src/lib/ornamentDb.js');

if (!existsSync(path.join(dataDir, 'ornament.db'))) {
  console.error('❌ DB not found at', dataDir, '\nRun: pnpm --filter @workspace/api-server run seed');
  process.exit(1);
}
if (!existsSync(OUT_DIR)) {
  console.error('❌ dist/public not found — run vite build first');
  process.exit(1);
}

const WHATSAPP_NUMBER = (process.env.VITE_WHATSAPP_NUMBER ?? '918368484361').replace(/\D/g, '');

const NICHE_DESC: Record<string, string> = {
  'korean-jewellery': 'Korean Jewellery',
  'fashion-jewellery': 'Fashion Jewellery',
  'anti-tarnish-jewellery': 'Anti Tarnish Jewellery',
  '18k-gold-plated-jewellery': '18k Gold Plated Jewellery',
  'demi-fine-jewellery': 'Demi Fine Jewellery',
  'western-jewellery': 'Western Jewellery',
};

const INTENT_NOUN: Record<string, string> = {
  wholesaler: 'Wholesaler',
  supplier: 'Supplier',
  manufacturer: 'Manufacturer',
  importer: 'Importer',
};

const WA_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:6px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function waLink(nicheKey: string, intent: string, location: string): string {
  const nd = NICHE_DESC[nicheKey] ?? nicheKey;
  const inNoun = INTENT_NOUN[intent] ?? intent;
  const msg = `Hi Arora Group Wholesale, I am a business owner in ${location}. Send me your latest wholesale catalog of trending ${nd}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const SHARED_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#FFF8F0;color:#1E1E1E;line-height:1.6}
a{color:inherit;text-decoration:none}
.top-banner{background:#1E1E1E;color:#FFC629;text-align:center;font-size:.75rem;font-weight:600;padding:.625rem 1rem}
header{background:#fff;border-bottom:1px solid #e8dcc8;padding:.875rem 1.5rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.wa-btn{display:inline-flex;align-items:center;background:#FFC629;color:#1E1E1E;font-weight:700;padding:.5rem 1rem;border-radius:.5rem;font-size:.875rem;transition:background .15s}
.wa-btn:hover{background:#e6b325}
footer{background:#1E1E1E;border-top:1px solid #333;padding:2rem 1.5rem;margin-top:2rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;font-size:.75rem;color:#888}
footer .logo{font-size:1.125rem;color:#FFC629}
`;

function renderSlugPage(page: any): string {
  if (!page) return '';
  const nd = NICHE_DESC[page.niche_key] ?? page.niche_key;
  const location = page.target_city ?? page.target_state;
  const waUrl = waLink(page.niche_key, page.intent_type, location);
  const canonicalUrl = `${BASE_URL}/${page.slug}/`;
  const statePage = `${page.niche_key}-${page.intent_type}-${page.state_slug}`;
  const inNoun = INTENT_NOUN[page.intent_type] ?? (page.intent_type.charAt(0).toUpperCase() + page.intent_type.slice(1));
  const seoTitle = `${BRAND_NAME} | Direct ${nd} ${inNoun} in ${location}`;
  const metaDesc = getMetaDescription(BRAND_ID, nd, BRAND_NAME, location);
  const faqs = getFaqs(BRAND_ID, nd, BRAND_NAME, location);

  const locationSlug = page.slug.substring(page.niche_key.length + 1 + page.intent_type.length + 1);

  const relatedCityLinks = (page.related_city_pages || []).map((r: any) => {
    const label = r.h1_heading ? r.h1_heading.replace(/.* in /, '') : (r.title.split('|')[1] || r.title).trim();
    return `<a href="${BASE_URL}/${esc(r.slug)}">${esc(label)}</a>`;
  }).join('\n          ');

  const relatedStateLinks = (page.related_state_pages || []).map((r: any) => {
    const label = r.h1_heading ? r.h1_heading.replace(/.* in /, '') : (r.title.split('|')[1] || r.title).trim();
    return `<a href="${BASE_URL}/${esc(r.slug)}">${esc(label)}</a>`;
  }).join('\n          ');

  const intentLinks = ['wholesaler', 'supplier', 'manufacturer', 'importer'].map(intent => {
    const targetSlug = `${page.niche_key}-${intent}-${locationSlug}`;
    const active = intent === page.intent_type ? ' class="active"' : '';
    return `<a href="${BASE_URL}/${esc(targetSlug)}"${active}>${intent}s</a>`;
  }).join('\n          ');

  const otherNicheLinks = Object.entries(NICHE_DESC)
    .filter(([k]) => k !== page.niche_key)
    .map(([k, name]) => {
      const s = `${k}-${page.intent_type}-${locationSlug}`;
      return `<a href="${BASE_URL}/${esc(s)}">${esc(name)} ${esc(inNoun)} in ${esc(location)}</a>`;
    }).join('\n          ');

  const reviewStripHtml = '<div style="margin-bottom:1.75rem">'
    + '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.875rem">'
    + '<span style="color:#FFC629;letter-spacing:.1em">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'
    + '<span style="font-size:.875rem;font-weight:700;color:#1E1E1E">5.0 on Google</span>'
    + '<span style="font-size:.75rem;color:#999">&nbspmiddot;&nbsp;10 reviews</span>'
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
  <title>${esc(seoTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${esc(seoTitle)}">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${BASE_URL}/opengraph.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(seoTitle)}">
  <meta name="twitter:description" content="${esc(metaDesc)}">
  <meta name="twitter:image" content="${BASE_URL}/opengraph.jpg">
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
    .intent-list{display:flex;flex-direction:column;gap:.25rem;margin-top:.375rem}
    .intent-list a{display:block;padding:.4375rem .75rem;border-radius:.5rem;font-size:.8125rem;color:#555;text-transform:capitalize}
    .intent-list a:hover{background:#fef3e2;color:#1E1E1E;text-decoration:none}
    .intent-list a.active{background:rgba(255,198,41,.18);border:1px solid rgba(255,198,41,.45);font-weight:600;color:#1E1E1E;pointer-events:none;cursor:default}
  </style>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WholesaleStore",
        "@id": `${canonicalUrl}#store`,
        name: BRAND_NAME,
        description: metaDesc,
        url: canonicalUrl,
        telephone: `+${WHATSAPP_NUMBER}`,
        areaServed: location,
        priceRange: "₹₹",
        address: {
          "@type": "PostalAddress",
          addressLocality: location,
          addressRegion: page.target_state,
          addressCountry: "IN",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: page.target_state, item: `${BASE_URL}/${statePage}` },
          ...(page.target_city
            ? [{ "@type": "ListItem", position: 3, name: page.target_city, item: canonicalUrl }]
            : []),
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  })}</script>
</head>
<body>
  <div class="top-banner">🔥 Source the Season's Most Viral Jewelry Designs Direct-from-Factory to ${esc(location)} · Low ₹3,000 MOV</div>
  <header>
    <a href="${BASE_URL}" style="display:inline-flex;align-items:center;text-decoration:none"><img src="/arora-group-logo.png" alt="Arora Group Wholesale" style="height:52px;width:auto"></a>
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
      <span class="badge">Verified Direct Wholesaler · Low ₹3,000 MOV</span>
      <h1>${esc(page.h1_heading)}</h1>
      <p class="lead">Direct factory sourcing for ${esc(location)} retailers with zero MOQ and 100% anti-tarnish guarantee.</p>

      <div class="trust-badges">
        <div class="trust-badge">
          <span>🌐</span>
          <div>
            <div>Direct Manufacturer</div>
            <div style="font-size:.6875rem;color:#888;font-weight:400">No middlemen markups</div>
          </div>
        </div>
        <div class="trust-badge">
          <span>💧</span>
          <div>
            <div>Anti-Tarnish Guaranteed</div>
            <div style="font-size:.6875rem;color:#888;font-weight:400">Waterproof daily wear</div>
          </div>
        </div>
        <div class="trust-badge">
          <span>📈</span>
          <div>
            <div>Pinterest Trending</div>
            <div style="font-size:.6875rem;color:#888;font-weight:400">Viral social designs</div>
          </div>
        </div>
        <div class="trust-badge">
          <span>🛒</span>
          <div>
            <div>Low ₹3,000 MOV</div>
            <div style="font-size:.6875rem;color:#888;font-weight:400">Zero item MOQ restrictions</div>
          </div>
        </div>
      </div>

      <div class="cta-box">
        <h2>Order Wholesale ${esc(nd)} in ${esc(location)}</h2>
        <p>Get our latest wholesale catalog with factory prices, live inventory, and fast dispatch details for ${esc(location)} retailers.</p>
        <a class="wa-cta" href="${waUrl}" target="_blank" rel="noopener noreferrer">${WA_ICON} WhatsApp Inquiry</a>
      </div>

      ${FOUNDER_VIDEO_ID ? `
      <div style="margin:2.5rem 0;background:#fff;border:1px solid #e8dcc8;border-radius:1rem;padding:1.5rem;box-shadow:0 4px 12px rgba(0,0,0,0.03)">
        <h2 style="font-family:Georgia,serif;font-size:1.25rem;font-weight:700;color:#1E1E1E;margin-bottom:.375rem">Meet the Founder — See the Collection Live</h2>
        <p style="font-size:.875rem;color:#555;margin-bottom:1.25rem">Watch Arora Group's founder showcase our full range of trending, waterproof, and anti-tarnish jewellery available for wholesale to ${esc(location)}.</p>
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:.75rem;background:#000">
          <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" src="https://www.youtube.com/embed/${FOUNDER_VIDEO_ID}" title="Arora Group Wholesale Collection Showcase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
      ` : ''}

      ${reviewStripHtml}

      <h2 class="section-h">Why ${esc(location)} Retailers Source ${esc(nd)} From Arora Group</h2>
      <p>Arora Group Wholesale supplies fashion boutiques, online sellers, and retail stores in ${esc(location)} with premium, on-trend jewellery at factory-direct prices. Our collections feature advanced PVD coating for true anti-tarnish and waterproof performance.</p>
      <p>With a low order minimum of ₹3,000 and zero item-level MOQ, you can test new styles with low risk and high profit margins.</p>

      <h2 class="section-h">Frequently Asked Questions</h2>
      ${faqs.map(f => `
      <details>
        <summary>${esc(f.q)}</summary>
        <p>${esc(f.a)}</p>
      </details>`).join('')}

      ${relatedCityLinks ? `
      <div style="margin-top:2.5rem">
        <div class="section-label">${esc(nd)} Supply in Nearby Cities — ${esc(page.target_state)}</div>
        <div class="related-grid">
          ${relatedCityLinks}
        </div>
      </div>` : ''}

      ${relatedStateLinks ? `
      <div style="margin-top:1.5rem">
        <div class="section-label">State-Wide Wholesale Supply</div>
        <div class="related-grid">
          ${relatedStateLinks}
        </div>
      </div>` : ''}

      <div style="margin-top:1.5rem">
        <div class="section-label">Other Wholesale Categories in ${esc(location)}</div>
        <div class="related-grid">
          ${otherNicheLinks}
        </div>
      </div>
    </div>

    <aside>
      <div class="cta-card">
        <h3>${esc(nd)} — ${esc(location)}</h3>
        <p>Direct wholesale catalog, pricing sheet, and dispatch details on WhatsApp.</p>
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
      <div class="info-card">
        <h4>Supply Type</h4>
        <div class="intent-list">
          ${intentLinks}
        </div>
      </div>
    </aside>
  </main>
  <footer style="display:block;padding:2rem 1.5rem">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1.5rem;margin-bottom:1.25rem">
      <div>
        <a href="${BASE_URL}" style="display:inline-flex;align-items:center;text-decoration:none"><img src="/arora-group-logo.png" alt="Arora Group Wholesale" style="height:40px;width:auto;background:#fff;border-radius:4px;padding:2px 6px"></a>
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

function writeSitemapBucket(name: string, slugs: string[], lastmod: string): string[] {
  const chunkCount = Math.ceil(slugs.length / SITEMAP_URL_CAP);
  const writtenFiles: string[] = [];

  for (let i = 0; i < chunkCount; i++) {
    const chunk = slugs.slice(i * SITEMAP_URL_CAP, (i + 1) * SITEMAP_URL_CAP);
    const filename = chunkCount === 1 ? `sitemap-${name}.xml` : `sitemap-${name}-${i + 1}.xml`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(s => `  <url>
    <loc>${BASE_URL}/${s}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

    writeFileSync(path.join(SITEMAP_DIR, filename), xml, 'utf-8');
    writeFileSync(path.join(OUT_DIR, filename), xml, 'utf-8');
    writtenFiles.push(filename);
  }

  return writtenFiles;
}

// ── Main Build Execution ────────────────────────────────────────────────────

console.log('🇮🇳 Starting Dedicated India SSG Pre-rendering…');

const allSlugs = getAllSlugs();
console.log(`Generating HTML for ${allSlugs.length} Indian pages…`);

const BUCKET_MAP: Record<string, string> = {
  North: 'north',
  South: 'south',
  West: 'west',
  East: 'east-central',
  Central: 'east-central',
  'North-East': 'east-central',
};

const buckets: Record<string, string[]> = {
  north: [],
  south: [],
  west: [],
  'east-central': [],
};

const pagesDir = path.join(OUT_DIR, 'pages');
mkdirSync(pagesDir, { recursive: true });

let generated = 0;
for (const entry of allSlugs) {
  const page = getPageBySlug(entry.slug);
  if (!page) continue;

  const pageDir = path.join(OUT_DIR, entry.slug);
  mkdirSync(pageDir, { recursive: true });

  const html = renderSlugPage(page);
  writeFileSync(path.join(pageDir, 'index.html'), html, 'utf-8');

  writeFileSync(
    path.join(pagesDir, `${entry.slug}.json`),
    JSON.stringify(page),
    'utf-8',
  );

  const bucketKey = BUCKET_MAP[entry.region] ?? 'north';
  buckets[bucketKey].push(entry.slug);

  generated++;
  if (generated % 500 === 0) {
    console.log(`  … ${generated}/${allSlugs.length}`);
  }
}

console.log(`✅ Generated ${generated} Indian HTML pages.`);

const today = new Date().toISOString().split('T')[0];
const allSitemapFiles: string[] = [];

for (const [name, slugs] of Object.entries(buckets)) {
  const files = writeSitemapBucket(name, slugs, today);
  allSitemapFiles.push(...files);
}

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapFiles.map(f => `  <sitemap>
    <loc>${BASE_URL}/${f}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

writeFileSync(path.join(SITEMAP_DIR, 'sitemap.xml'), sitemapIndex, 'utf-8');
writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemapIndex, 'utf-8');
console.log('✅ sitemap.xml written with', allSitemapFiles.length, 'regional sitemaps.');

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
writeFileSync(path.join(OUT_DIR, 'robots.txt'), robotsTxt, 'utf-8');
console.log('✅ robots.txt written.');

writeFileSync(
  path.join(OUT_DIR, 'cities.json'),
  JSON.stringify(getAllCities()),
  'utf-8',
);
console.log('✅ cities.json written.');

console.log('\n🎉 India SSG Complete.');
