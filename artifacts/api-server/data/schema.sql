-- Project Ornament: B2B Jewelry pSEO Engine
-- SQLite Schema

-- Table: locations
-- Purpose: Houses the rigid geographic dataset across India
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_name TEXT NOT NULL,
    state_name TEXT NOT NULL,
    city_slug TEXT NOT NULL UNIQUE,
    state_slug TEXT NOT NULL,
    region TEXT NOT NULL CHECK(region IN ('North', 'South', 'West', 'East', 'Central', 'North-East'))
);

-- Table: states
-- Purpose: All 36 Indian states and union territories
CREATE TABLE IF NOT EXISTS states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_name TEXT NOT NULL,
    state_slug TEXT NOT NULL UNIQUE,
    region TEXT NOT NULL CHECK(region IN ('North', 'South', 'West', 'East', 'Central', 'North-East'))
);

-- Table: keywords
-- Purpose: Holds atomic components of the high-intent B2B search phrases
CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_phrase TEXT NOT NULL UNIQUE,
    niche_key TEXT NOT NULL,
    intent_type TEXT NOT NULL CHECK(intent_type IN ('wholesaler', 'supplier', 'manufacturer', 'importer'))
);

-- Table: programmatic_pages
-- Purpose: Operational routing engine. Holds pre-computed SEO titles, headings, and data relations.
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
    region TEXT NOT NULL
);

-- Optimization Index for Instant Dynamic Route Matching
CREATE INDEX IF NOT EXISTS idx_pages_slug ON programmatic_pages(slug);
CREATE INDEX IF NOT EXISTS idx_locations_state ON locations(state_slug);
CREATE INDEX IF NOT EXISTS idx_pages_niche_intent ON programmatic_pages(niche_key, intent_type);
