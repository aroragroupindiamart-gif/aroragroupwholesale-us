export const BRAND_ID = process.env.VITE_BRAND_ID || process.env.BRAND_ID || 'aroragroupwholesale';
export const BRAND_NAME = process.env.VITE_BRAND_NAME || process.env.BRAND_NAME || 'Arora Group Wholesale';
export const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://www.aroragroupwholesale.com').replace(/\/$/, '');
export const WHATSAPP_NUMBER = (process.env.VITE_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '919999999999').replace(/\D/g, '');

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
