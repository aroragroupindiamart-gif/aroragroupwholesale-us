const getEnv = (key: string): string | undefined => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch {}
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

export const BRAND_ID = getEnv('VITE_BRAND_ID') || 'aroragroupwholesale';
export const BRAND_NAME = getEnv('VITE_BRAND_NAME') || 'Arora Group Wholesale';
export const SITE_URL = (getEnv('VITE_SITE_URL') || 'https://www.aroragroupwholesale.com').replace(/\/$/, '');
export const WHATSAPP_NUMBER = (getEnv('VITE_WHATSAPP_NUMBER') || '919999999999').replace(/\D/g, '');
export const FOUNDER_VIDEO_ID = getEnv('VITE_FOUNDER_VIDEO_ID') || '2J4ztUw796I';

export const TOP_BANNER = getEnv('VITE_TOP_BANNER') || "🔥 Source the Season's Most Viral Jewelry Designs Direct-from-Factory Across India — Minimum Order Value: ₹3,000";
export const HERO_BADGE = getEnv('VITE_HERO_BADGE') || "Direct Importer & Wholesaler · Pan-India";
export const HERO_TITLE = getEnv('VITE_HERO_TITLE') || `${BRAND_NAME}: Viral, Trend-Driven Jewelry Supply Across India`;
export const HERO_DESCRIPTION = getEnv('VITE_HERO_DESCRIPTION') || "We are India's direct premium importer and trend scout for fast-selling jewelry. From viral Instagram aesthetics to high-demand Pinterest styles, we source and supply retail brands and online sellers in every major city.";
export const ABOUT_TITLE = getEnv('VITE_ABOUT_TITLE') || `About ${BRAND_NAME}`;
export const ABOUT_STORY = getEnv('VITE_ABOUT_STORY') || `${BRAND_NAME} operates as a leading B2B trend importer and supplier based in Delhi. We bridge the gap between global trend factories and Indian jewelry sellers with fast restocking and certified purity.`;

export const REVIEWS = [
  {
    name: 'Divya Anand Kumar',
    role: 'Retailer · Delhi',
    text: 'Genuinely very satisfied with the product quality and variety. Best partnership ever done — special thanks for solving every problem and restocking issue. Having great experience and will continue doing business.',
    rating: 5,
  },
  {
    name: 'Sumit Chhabra',
    role: 'Local Guide · Verified Buyer',
    text: 'Genuine seller. Pleasure having business partnership! Was just experimenting a few months back but now my permanent source of items.',
    rating: 5,
  },
  {
    name: 'Mayank Arora',
    role: 'Local Guide · Verified Buyer',
    text: 'Best wholesaler of Korean and anti-tarnish jewellery in Delhi. Price is so affordable and quality is top notch.',
    rating: 5,
  },
  {
    name: 'Local Guide',
    role: 'Local Guide · 42 Reviews',
    text: 'One of the best imitation jewellery wholesale shops in Delhi. Owner is very helpful in selecting items and assists step by step during delivery.',
    rating: 5,
  },
] as const;

export const ADDRESS = getEnv('VITE_ADDRESS') || 'E-134, 1st Floor, Tagore Garden Extension, New Delhi – 110027';
export const PHONE = getEnv('VITE_PHONE') || '+91 83684 84361';
export const GOOGLE_MAPS_URL = getEnv('VITE_GOOGLE_MAPS_URL') || 'https://share.google/iixMlvHVU6EAIkYWo';
export const INSTAGRAM_URL = getEnv('VITE_INSTAGRAM_URL') || 'https://www.instagram.com/arora_group_wholesale/';
export const YOUTUBE_URL = getEnv('VITE_YOUTUBE_URL') || 'https://www.youtube.com/watch?v=2J4ztUw796I';
export const FACEBOOK_URL = getEnv('VITE_FACEBOOK_URL') || 'https://www.facebook.com/share/r/1EjSCvh19b/';
