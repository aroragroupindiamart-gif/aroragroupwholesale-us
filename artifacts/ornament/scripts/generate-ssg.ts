/**
 * Project Ornament — SSG Dispatcher
 *
 * Automatically delegates to the dedicated target script:
 * - US Market:    generate-ssg-us.ts
 * - India Market: generate-ssg-india.ts
 */

const brandId = process.env.VITE_BRAND_ID || 'aroragroupwholesale';
const isUS = brandId.includes('-us');

if (isUS) {
  await import('./generate-ssg-us.js');
} else {
  await import('./generate-ssg-india.js');
}
