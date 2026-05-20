-- Project Ornament: B2B Jewelry pSEO Engine
-- SQLite Schema — 3 core tables

-- Table: locations
-- Houses the rigid geographic dataset across 122 Indian cities
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_name TEXT NOT NULL,
    state_name TEXT NOT NULL,
    city_slug TEXT NOT NULL UNIQUE,
    state_slug TEXT NOT NULL,
    region TEXT NOT NULL CHECK(region IN ('North', 'South', 'West', 'East', 'Central', 'North-East'))
);

-- Table: keywords
-- Holds atomic components of the high-intent B2B search phrases
-- 6 niches × 4 intents = 24 rows
CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_phrase TEXT NOT NULL UNIQUE,
    niche_key TEXT NOT NULL,
    intent_type TEXT NOT NULL CHECK(intent_type IN ('wholesaler', 'supplier', 'manufacturer', 'importer'))
);

-- Table: programmatic_pages
-- Operational routing engine. Pre-computed SEO titles, headings, and data relations.
-- 3,792 rows: 2,928 city pages + 864 state pages
CREATE TABLE IF NOT EXISTS programmatic_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_type TEXT NOT NULL CHECK(page_type IN ('city', 'state')),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    h1_heading TEXT NOT NULL,
    niche_key TEXT NOT NULL,
    intent_type TEXT NOT NULL,
    target_city TEXT,
    target_state TEXT NOT NULL,
    state_slug TEXT NOT NULL,
    region TEXT NOT NULL
);

-- Indexes for instant slug lookup and related-page queries
CREATE INDEX IF NOT EXISTS idx_pages_slug ON programmatic_pages(slug);
CREATE INDEX IF NOT EXISTS idx_locations_state ON locations(state_slug);
CREATE INDEX IF NOT EXISTS idx_pages_niche_intent ON programmatic_pages(niche_key, intent_type);
CREATE INDEX IF NOT EXISTS idx_pages_state_slug ON programmatic_pages(state_slug);
