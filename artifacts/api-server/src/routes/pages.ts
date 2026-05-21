import { Router } from 'express';
import {
  getPageBySlug,
  getAllSlugs,
  getAllStates,
  getAllNiches,
  searchCities,
} from '../lib/ornamentDb.js';

const router = Router();

// GET /api/pages — list all slugs for sitemap
router.get('/pages', (_req, res) => {
  try {
    const slugs = getAllSlugs();
    res.json(slugs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load page slugs' });
  }
});

// GET /api/pages/:slug — get a full page by slug
router.get('/pages/:slug', (req, res) => {
  try {
    const page = getPageBySlug(req.params.slug);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load page' });
  }
});

// GET /api/states — list all states grouped by region
router.get('/states', (_req, res) => {
  try {
    const states = getAllStates();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load states' });
  }
});

// GET /api/niches — list all jewelry niches
router.get('/niches', (_req, res) => {
  try {
    const niches = getAllNiches();
    res.json(niches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load niches' });
  }
});

// GET /api/cities?q=search_term — search cities by name (up to 8 results)
router.get('/cities', (req, res) => {
  try {
    const q = String(req.query.q ?? '').trim();
    if (q.length < 1) {
      res.json([]);
      return;
    }
    const cities = searchCities(q);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search cities' });
  }
});

export default router;
