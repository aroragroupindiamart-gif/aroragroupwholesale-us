export const BRAND_NAME = 'Arora Group Wholesale';
export const SITE_URL = 'https://www.aroragroupwholesale.com';
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '919999999999';

export const NICHE_DISPLAY: Record<string, string> = {
  'korean-jewellery': 'Korean Jewellery',
  'fashion-jewellery': 'Fashion Jewellery',
  'anti-tarnish-jewellery': 'Anti Tarnish Jewellery',
  '18k-gold-plated-jewellery': '18k Gold Plated Jewellery',
  'demi-fine-jewellery': 'Demi Fine Jewellery',
  'western-jewellery': 'Western Jewellery',
};

export const NICHE_ICONS: Record<string, string> = {
  'korean-jewellery': '🌸',
  'fashion-jewellery': '✨',
  'anti-tarnish-jewellery': '🛡️',
  '18k-gold-plated-jewellery': '🥇',
  'demi-fine-jewellery': '💎',
  'western-jewellery': '⭐',
};

export const INTENT_DISPLAY: Record<string, { verb: string; noun: string; plural: string }> = {
  wholesaler: { verb: 'wholesale', noun: 'wholesaler', plural: 'wholesalers' },
  supplier: { verb: 'supply', noun: 'supplier', plural: 'suppliers' },
  manufacturer: { verb: 'manufacture', noun: 'manufacturer', plural: 'manufacturers' },
  importer: { verb: 'import', noun: 'importer', plural: 'importers' },
};
