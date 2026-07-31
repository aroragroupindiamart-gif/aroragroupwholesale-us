export const BRAND_ID = process.env.VITE_BRAND_ID || process.env.BRAND_ID || 'aroragroupwholesale';
export const BRAND_NAME = process.env.VITE_BRAND_NAME || process.env.BRAND_NAME || 'Arora Group Wholesale';
export const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://www.aroragroupwholesale.com').replace(/\/$/, '');
export const WHATSAPP_NUMBER = (process.env.VITE_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '918368484361').replace(/\D/g, '');

export const TOP_BANNER = process.env.VITE_TOP_BANNER || "🔥 Source the Season's Most Viral Jewelry Designs Direct-from-Factory Across India — Minimum Order Value: ₹3,000";
export const HERO_BADGE = process.env.VITE_HERO_BADGE || "Direct Importer & Wholesaler · Pan-India";
export const HERO_TITLE = process.env.VITE_HERO_TITLE || `${BRAND_NAME}: Viral, Trend-Driven Jewelry Supply Across India`;
export const HERO_DESCRIPTION = process.env.VITE_HERO_DESCRIPTION || "We are India's direct premium importer and trend scout for fast-selling jewelry. From viral Instagram aesthetics to high-demand Pinterest styles, we source and supply retail brands and online sellers in every major city.";
export const ABOUT_TITLE = process.env.VITE_ABOUT_TITLE || `About ${BRAND_NAME}`;
export const ABOUT_STORY = process.env.VITE_ABOUT_STORY || `${BRAND_NAME} operates as a leading B2B trend importer and supplier based in Delhi. We bridge the gap between global trend factories and Indian jewelry sellers with fast restocking and certified purity.`;

export const NICHE_DISPLAY: Record<string, string> = {
  'korean-jewellery': 'Korean Jewellery',
  'fashion-jewellery': 'Fashion Jewellery',
  'anti-tarnish-jewellery': 'Anti Tarnish Jewellery',
  '18k-gold-plated-jewellery': '18k Gold Plated Jewellery',
  'demi-fine-jewellery': 'Demi Fine Jewellery',
  'western-jewellery': 'Western Jewellery',
};

export const INTENT_DISPLAY: Record<string, string> = {
  wholesaler: 'Wholesaler',
  supplier: 'Supplier',
  manufacturer: 'Manufacturer',
  importer: 'Importer',
};

export const INTENTS = ['wholesaler', 'supplier', 'manufacturer', 'importer'] as const;
export type Intent = typeof INTENTS[number];

export const NICHES = Object.keys(NICHE_DISPLAY);
