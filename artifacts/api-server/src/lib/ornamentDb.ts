import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
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
  region: string;
};

export function getPageBySlug(slug: string): PageDetail | null {
  const db = getDb();
  const page = db.prepare(`SELECT * FROM programmatic_pages WHERE slug = ?`).get(slug) as RawPageRow | undefined;
  if (!page) return null;

  const relatedCity = db.prepare(`
    SELECT slug, title, h1_heading FROM programmatic_pages
    WHERE niche_key = ? AND intent_type = ? AND page_type = 'city' AND target_state = ? AND slug != ?
    LIMIT 8
  `).all(page.niche_key, page.intent_type, page.target_state, slug) as PageLink[];

  const relatedState = db.prepare(`
    SELECT slug, title, h1_heading FROM programmatic_pages
    WHERE niche_key = ? AND intent_type = ? AND page_type = 'state' AND slug != ?
    LIMIT 4
  `).all(page.niche_key, page.intent_type, slug) as PageLink[];

  return { ...page, related_city_pages: relatedCity, related_state_pages: relatedState };
}

export function getAllSlugs(): SlugEntry[] {
  const db = getDb();
  return db.prepare(`SELECT slug, page_type, region FROM programmatic_pages ORDER BY slug`).all() as SlugEntry[];
}

export function getAllStates(): StateInfo[] {
  const db = getDb();
  return db.prepare(`SELECT state_name, state_slug, region FROM states ORDER BY region, state_name`).all() as StateInfo[];
}

export function getAllNiches(): NicheInfo[] {
  return Object.entries(NICHE_DISPLAY).map(([niche_key, display_name]) => ({ niche_key, display_name }));
}
