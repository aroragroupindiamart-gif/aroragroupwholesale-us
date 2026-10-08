/**
 * Content Spinner & Variation Engine for Multi-Domain pSEO
 * 
 * Provides deterministic variation choices based on brand ID to prevent
 * duplicate content penalties across multiple domains while keeping
 * exact cities, niches, intents, and 3,792 page count intact.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface ContentVariations {
  metaDesc: (nd: string, brandName: string, location: string) => string;
  faqs: (nd: string, brandName: string, location: string) => FaqItem[];
  valueProps: (nd: string, brandName: string, location: string) => string[];
  ctaHeadline: (nd: string, location: string) => string;
}

// Simple hash to select deterministic variation index based on string seed
function seedIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

// Variation Sets
const META_DESC_TEMPLATES = [
  (nd: string, brand: string, loc: string) =>
    `Source viral, Pinterest-trending ${nd} direct from ${brand} in ${loc}. Low ₹3,000 order value, 100% tarnish-free, zero item MOQ. Get our latest catalog via WhatsApp!`,
  (nd: string, brand: string, loc: string) =>
    `Premium B2B supplier of ${nd} serving retail businesses in ${loc}. Direct factory pricing from ${brand}, ₹3,000 MOV, zero item MOQ, and nationwide insured dispatch.`,
  (nd: string, brand: string, loc: string) =>
    `Looking for wholesale ${nd} in ${loc}? Partner with ${brand} for anti-tarnish, trend-ready inventory. Low MOV of ₹3,000 and express door delivery.`,
  (nd: string, brand: string, loc: string) =>
    `Connect with ${brand} for direct wholesale sourcing of ${nd} in ${loc}. High-margin curated designs, ₹3,000 MOV, and guaranteed batch quality.`,
];

const CTA_HEADLINES = [
  (nd: string, loc: string) => `Ready to Source Bulk ${nd} in ${loc}?`,
  (nd: string, loc: string) => `Upgrade Your Retail Inventory of ${nd} in ${loc}`,
  (nd: string, loc: string) => `Get Direct Wholesale Access to ${nd} for ${loc} Retailers`,
  (nd: string, loc: string) => `Partner with India's Leading ${nd} Wholesaler for ${loc}`,
];

export function getMetaDescription(brandId: string, nicheDesc: string, brandName: string, location: string): string {
  if (brandId.includes('-us')) {
    return `Direct B2B importer of Korean, anti-tarnish & 18k gold-plated ${nicheDesc} for US retailers in ${location}. Low $100 MOV, express air shipping across USA. WhatsApp for catalog!`;
  }
  const idx = seedIndex(brandId, META_DESC_TEMPLATES.length);
  return META_DESC_TEMPLATES[idx](nicheDesc, brandName, location);
}

export function getCtaHeadline(brandId: string, nicheDesc: string, location: string): string {
  const idx = seedIndex(brandId, CTA_HEADLINES.length);
  return CTA_HEADLINES[idx](nicheDesc, location);
}

export function getFaqs(brandId: string, nicheDesc: string, brandName: string, location: string): FaqItem[] {
  if (brandId.includes('-us')) {
    return [
      {
        q: `How do US boutiques and retail stores in ${location} order wholesale ${nicheDesc} from ${brandName}?`,
        a: `${brandName} offers direct B2B purchasing for US boutique owners, Shopify sellers, and retail stores in ${location}. Our Minimum Order Value is $100 USD with zero SKU-level minimums. Contact us via WhatsApp or email to receive our latest B2B catalog.`,
      },
      {
        q: `What are the shipping times and delivery carriers for orders to ${location}?`,
        a: `Orders to ${location} are dispatched via express door-to-door air freight using DHL Express or FedEx. Standard delivery lead time to any US address is 4–7 business days.`,
      },
      {
        q: `Are ${nicheDesc} items tarnish-free and suitable for US retail customers?`,
        a: `Yes, all ${nicheDesc} collections feature multi-layer PVD vacuum plating and anti-tarnish protective sealing, making them 100% waterproof, hypoallergenic, and retail-ready for the US market.`,
      },
      {
        q: `Can I mix different jewelry categories to meet the $100 MOV requirement?`,
        a: `Absolutely! You can freely mix earrings, necklaces, rings, bracelets, and anklets in a single $100 USD order without any single-design MOQ restrictions.`,
      },
      {
        q: `What payment options are accepted for US wholesale accounts?`,
        a: `We accept Credit/Debit Cards, Wire Transfers (ACH/SWIFT), PayPal, and major corporate payment channels for US retail buyers.`,
      },
    ];
  }

  const v = seedIndex(brandId, 3);

  if (v === 1) {
    return [
      {
        q: `How do retail businesses in ${location} order wholesale ${nicheDesc} from ${brandName}?`,
        a: `${brandName} provides direct B2B invoicing for retail shop owners and online sellers in ${location}. Our Minimum Order Value is ₹3,000 with zero SKU-level minimums. Simply WhatsApp your business details to request our latest digital catalog.`,
      },
      {
        q: `What quality and coating standards apply to ${nicheDesc} supplied by ${brandName}?`,
        a: `All ${nicheDesc} items feature premium anti-tarnish protective coatings and verified metal purity. Batch-level inspection tags ensure every piece shipped to ${location} meets retail-grade finishing standards.`,
      },
      {
        q: `Does ${brandName} provide custom OEM or volume branding for ${location} buyers?`,
        a: `Yes, we support custom OEM orders, private label packaging, and sample runs starting from 50 units per SKU with 15–25 day turnaround times for ${location} accounts.`,
      },
      {
        q: `What are the shipping timelines and insurance coverage for ${location}?`,
        a: `Shipments to ${location} are dispatched via air or express surface courier with full transit insurance. Typical delivery time is 3–5 working days after order dispatch.`,
      },
      {
        q: `What is the payment structure and MOV requirement for new trade accounts?`,
        a: `The minimum purchase requirement is ₹3,000 per order across any mix of products. Payment can be settled via UPI, NEFT, or standard business banking channels.`,
      },
    ];
  } else if (v === 2) {
    return [
      {
        q: `Why choose ${brandName} as your ${nicheDesc} B2B distributor in ${location}?`,
        a: `${brandName} eliminates middlemen by offering factory-direct pricing, flexible category mixing, and rapid inventory replenishment for store owners in ${location}.`,
      },
      {
        q: `Are ${nicheDesc} collections guaranteed tarnish-resistant?`,
        a: `Yes. Our anti-tarnish and gold-plated jewelry lines utilize multi-layer PVD and electro-coating processes for long-lasting sheen and durability in commercial retail environments.`,
      },
      {
        q: `Can I order mixed product categories to meet the ₹3,000 MOV?`,
        a: `Absolutely. You can freely combine rings, earrings, necklaces, and anklets in a single ₹3,000 order without any single-design MOQ constraints.`,
      },
      {
        q: `How are bulk parcels dispatched to ${location}?`,
        a: `Parcels destined for ${location} are double-checked, tamper-sealed, and insured with top logistics partners including BlueDart and Delhivery.`,
      },
      {
        q: `How fast can I get catalog updates for ${location} store stocking?`,
        a: `New designs are released weekly. Message our WhatsApp support team with your business name to join our exclusive broadcast list for ${location} buyers.`,
      },
    ];
  }

  // Default variation (Set 0)
  return [
    {
      q: `What are the corporate purchasing terms for ${nicheDesc} from ${brandName}?`,
      a: `${brandName} operates as a direct importer and trend wholesaler. Orders are processed against GST-registered business invoices with a Minimum Order Value (MOV) of ₹3,000 — with no item-level MOQ restrictions, so you can mix and match any designs freely. Payment terms include advance, 50/50, or credit terms for established wholesale accounts.`,
    },
    {
      q: `What metal purity certifications does ${brandName} provide for ${nicheDesc}?`,
      a: `Every ${nicheDesc} piece from our factory carries certified metallic purity documentation. Anti-tarnish collections include a BIS-aligned coating verification, while gold-plated lines are tested for micron thickness. All certificates are issued per batch and available for retailer audit at any time.`,
    },
    {
      q: `Can ${brandName} handle custom wholesale design processing for ${location} retailers?`,
      a: `Yes. Our design manufacturing wing accepts custom briefs, buyer-provided sketches, and OEM requests. Minimum custom order runs start at 50 pieces per SKU. Design-to-delivery lead time is 15–25 business days depending on complexity. Samples are dispatched within 5 working days upon approval of design confirmation.`,
    },
    {
      q: `How does ${brandName} handle logistics and insurance for deliveries to ${location}?`,
      a: `All shipments to ${location} are dispatched via fully insured air freight or tracked surface courier. Packages include transit insurance up to invoice value. ${brandName} partners with BlueDart, Delhivery, and Ecom Express for last-mile delivery. Standard delivery timelines are 3–7 working days from dispatch.`,
    },
    {
      q: `What is the minimum order value and how do I place a wholesale inquiry?`,
      a: `The Minimum Order Value (MOV) for ${brandName} wholesale supply is just ₹3,000 per invoice — with zero item-level MOQ, freely mix and match rings, anklets, necklaces, or any category. To place an inquiry, WhatsApp us your business name, GST number, required ${nicheDesc} category, and approximate quantity. Our team will respond within 4 business hours.`,
    },
  ];
}
