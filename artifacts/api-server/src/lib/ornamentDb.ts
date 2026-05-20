import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// ORNAMENT_DATA_DIR allows the SSG script to override the path when importing
// this module via tsx (where __dirname points to src/lib, not dist/).
const DATA_DIR = process.env.ORNAMENT_DATA_DIR ?? path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'ornament.db');
const SCHEMA_PATH = path.join(DATA_DIR, 'schema.sql');

function initDb(): DatabaseSync {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA cache_size = -16000");
  const schema = readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);
  return db;
}

let _db: DatabaseSync | null = null;
function getDb(): DatabaseSync {
  if (!_db) {
    _db = initDb();
  }
  return _db;
}

export interface PageLink {
  slug: string;
  title: string;
  h1_heading: string;
}

export interface PageDetail {
  id: number;
  page_type: string;
  slug: string;
  title: string;
  h1_heading: string;
  niche_key: string;
  intent_type: string;
  target_city: string | null;
  target_state: string;
  state_slug: string;
  region: string;
  related_city_pages: PageLink[];
  related_state_pages: PageLink[];
}

export interface SlugEntry {
  slug: string;
  page_type: string;
  region: string;
}

export interface StateInfo {
  state_name: string;
  state_slug: string;
  region: string;
}

export interface NicheInfo {
  niche_key: string;
  display_name: string;
}

// Static lookup — no extra DB table needed
const STATES: StateInfo[] = [
  { state_name: 'Delhi', state_slug: 'delhi', region: 'North' },
  { state_name: 'Haryana', state_slug: 'haryana', region: 'North' },
  { state_name: 'Himachal Pradesh', state_slug: 'himachal-pradesh', region: 'North' },
  { state_name: 'Jammu and Kashmir', state_slug: 'jammu-and-kashmir', region: 'North' },
  { state_name: 'Ladakh', state_slug: 'ladakh', region: 'North' },
  { state_name: 'Punjab', state_slug: 'punjab', region: 'North' },
  { state_name: 'Rajasthan', state_slug: 'rajasthan', region: 'North' },
  { state_name: 'Uttar Pradesh', state_slug: 'uttar-pradesh', region: 'North' },
  { state_name: 'Uttarakhand', state_slug: 'uttarakhand', region: 'North' },
  { state_name: 'Chandigarh', state_slug: 'chandigarh', region: 'North' },
  { state_name: 'Andhra Pradesh', state_slug: 'andhra-pradesh', region: 'South' },
  { state_name: 'Karnataka', state_slug: 'karnataka', region: 'South' },
  { state_name: 'Kerala', state_slug: 'kerala', region: 'South' },
  { state_name: 'Lakshadweep', state_slug: 'lakshadweep', region: 'South' },
  { state_name: 'Puducherry', state_slug: 'puducherry', region: 'South' },
  { state_name: 'Tamil Nadu', state_slug: 'tamil-nadu', region: 'South' },
  { state_name: 'Telangana', state_slug: 'telangana', region: 'South' },
  { state_name: 'Andaman and Nicobar Islands', state_slug: 'andaman-and-nicobar-islands', region: 'South' },
  { state_name: 'Dadra and Nagar Haveli and Daman and Diu', state_slug: 'dadra-nagar-haveli-daman-diu', region: 'West' },
  { state_name: 'Goa', state_slug: 'goa', region: 'West' },
  { state_name: 'Gujarat', state_slug: 'gujarat', region: 'West' },
  { state_name: 'Maharashtra', state_slug: 'maharashtra', region: 'West' },
  { state_name: 'Bihar', state_slug: 'bihar', region: 'East' },
  { state_name: 'Jharkhand', state_slug: 'jharkhand', region: 'East' },
  { state_name: 'Odisha', state_slug: 'odisha', region: 'East' },
  { state_name: 'West Bengal', state_slug: 'west-bengal', region: 'East' },
  { state_name: 'Chhattisgarh', state_slug: 'chhattisgarh', region: 'Central' },
  { state_name: 'Madhya Pradesh', state_slug: 'madhya-pradesh', region: 'Central' },
  { state_name: 'Arunachal Pradesh', state_slug: 'arunachal-pradesh', region: 'North-East' },
  { state_name: 'Assam', state_slug: 'assam', region: 'North-East' },
  { state_name: 'Manipur', state_slug: 'manipur', region: 'North-East' },
  { state_name: 'Meghalaya', state_slug: 'meghalaya', region: 'North-East' },
  { state_name: 'Mizoram', state_slug: 'mizoram', region: 'North-East' },
  { state_name: 'Nagaland', state_slug: 'nagaland', region: 'North-East' },
  { state_name: 'Sikkim', state_slug: 'sikkim', region: 'North-East' },
  { state_name: 'Tripura', state_slug: 'tripura', region: 'North-East' },
];

const NICHE_DISPLAY: Record<string, string> = {
  'gold-jewelry': 'Gold Jewelry',
  'silver-jewelry': 'Silver Jewelry',
  'diamond-jewelry': 'Diamond Jewelry',
  'artificial-jewelry': 'Artificial Jewelry',
  'bridal-jewelry': 'Bridal Jewelry',
  'fashion-jewelry': 'Fashion Jewelry',
};

type RawPageRow = {
  id: number;
  page_type: string;
  slug: string;
  title: string;
  h1_heading: string;
  niche_key: string;
  intent_type: string;
  target_city: string | null;
  target_state: string;
  state_slug: string;
  region: string;
};

export function getRelatedCityPages(
  nicheKey: string,
  intentType: string,
  stateName: string,
  excludeSlug: string,
  limit = 8,
): PageLink[] {
  return getDb().prepare(`
    SELECT slug, title, h1_heading FROM programmatic_pages
    WHERE niche_key = ? AND intent_type = ? AND page_type = 'city' AND target_state = ? AND slug != ?
    LIMIT ?
  `).all(nicheKey, intentType, stateName, excludeSlug, limit) as PageLink[];
}

export function getRelatedStatePages(
  nicheKey: string,
  intentType: string,
  excludeSlug: string,
  limit = 4,
): PageLink[] {
  return getDb().prepare(`
    SELECT slug, title, h1_heading FROM programmatic_pages
    WHERE niche_key = ? AND intent_type = ? AND page_type = 'state' AND slug != ?
    LIMIT ?
  `).all(nicheKey, intentType, excludeSlug, limit) as PageLink[];
}

export function getPageBySlug(slug: string): PageDetail | null {
  const db = getDb();
  const page = db.prepare(`SELECT * FROM programmatic_pages WHERE slug = ?`).get(slug) as RawPageRow | undefined;
  if (!page) return null;
  return {
    ...page,
    related_city_pages: getRelatedCityPages(page.niche_key, page.intent_type, page.target_state, slug),
    related_state_pages: getRelatedStatePages(page.niche_key, page.intent_type, slug),
  };
}

export function getAllSlugs(): SlugEntry[] {
  const db = getDb();
  return db.prepare(`SELECT slug, page_type, region FROM programmatic_pages ORDER BY slug`).all() as SlugEntry[];
}

export function getAllStates(): StateInfo[] {
  return STATES;
}

export function getAllNiches(): NicheInfo[] {
  return Object.entries(NICHE_DISPLAY).map(([niche_key, display_name]) => ({ niche_key, display_name }));
}
