import { useQuery } from "@tanstack/react-query";

export type StaticPage = {
  slug: string;
  niche_key: string;
  intent_type: string;
  target_city: string | null;
  target_state: string;
  state_slug: string;
  region: string;
  h1_heading: string;
  related_city_pages: { slug: string; title: string; h1_heading?: string }[];
  related_state_pages: { slug: string; title: string; h1_heading?: string }[];
  page_type?: string;
};

const US_STATE_CODE_TO_NAME: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const US_STATE_SLUG_TO_INFO: Record<string, { code: string; name: string }> = Object.entries(US_STATE_CODE_TO_NAME).reduce((acc, [code, name]) => {
  acc[name.toLowerCase().replace(/\s+/g, '-')] = { code, name };
  return acc;
}, {} as Record<string, { code: string; name: string }>);

const NICHE_KEYS = [
  'korean-jewellery',
  'fashion-jewellery',
  'anti-tarnish-jewellery',
  '18k-gold-plated-jewellery',
  'demi-fine-jewellery',
  'western-jewellery',
];

const INTENT_KEYS = ['wholesaler', 'supplier', 'manufacturer', 'importer'];

const NICHE_TITLES: Record<string, string> = {
  'korean-jewellery': 'Korean Jewellery',
  'fashion-jewellery': 'Fashion Jewellery',
  'anti-tarnish-jewellery': 'Anti Tarnish Jewellery',
  '18k-gold-plated-jewellery': '18k Gold Plated Jewellery',
  'demi-fine-jewellery': 'Demi Fine Jewellery',
  'western-jewellery': 'Western Jewellery',
};

const INTENT_NOUNS: Record<string, string> = {
  wholesaler: 'Wholesaler',
  supplier: 'Supplier',
  manufacturer: 'Manufacturer',
  importer: 'Importer',
};

function synthesizePageFromSlug(slug: string): StaticPage | null {
  const normalized = slug.replace(/^\/+|\/+$/g, '').toLowerCase();

  for (const niche of NICHE_KEYS) {
    if (!normalized.startsWith(`${niche}-`)) continue;
    const afterNiche = normalized.slice(niche.length + 1);

    for (const intent of INTENT_KEYS) {
      if (!afterNiche.startsWith(`${intent}-`)) continue;
      const remainder = afterNiche.slice(intent.length + 1);

      // Check for City: [place]-[2-letter-state-code]
      const cityMatch = remainder.match(/^(.*)-([a-z]{2})$/i);
      if (cityMatch) {
        const placeSlug = cityMatch[1];
        const stateCode = cityMatch[2].toUpperCase();
        const stateName = US_STATE_CODE_TO_NAME[stateCode] || stateCode;
        const placeName = placeSlug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        return {
          slug: normalized,
          niche_key: niche,
          intent_type: intent,
          target_city: `${placeName}, ${stateCode}`,
          target_state: stateName,
          state_slug: stateName.toLowerCase().replace(/\s+/g, '-'),
          region: `US-${stateCode}`,
          h1_heading: `${NICHE_TITLES[niche]} ${INTENT_NOUNS[intent]} in ${placeName}, ${stateName} (${stateCode})`,
          related_city_pages: [
            { slug: `${niche}-wholesaler-${remainder}`, title: `${NICHE_TITLES[niche]} Wholesaler in ${placeName}, ${stateCode}` },
            { slug: `${niche}-supplier-${remainder}`, title: `${NICHE_TITLES[niche]} Supplier in ${placeName}, ${stateCode}` },
            { slug: `${niche}-manufacturer-${remainder}`, title: `${NICHE_TITLES[niche]} Manufacturer in ${placeName}, ${stateCode}` },
            { slug: `${niche}-importer-${remainder}`, title: `${NICHE_TITLES[niche]} Importer in ${placeName}, ${stateCode}` },
          ],
          related_state_pages: [
            { slug: `${niche}-${intent}-${stateName.toLowerCase().replace(/\s+/g, '-')}`, title: `${NICHE_TITLES[niche]} in ${stateName}` },
          ],
          page_type: 'city',
        };
      }

      // Check for State: [state-slug] or [2-letter-state-code]
      let stateInfo = US_STATE_SLUG_TO_INFO[remainder];
      if (!stateInfo && remainder.length === 2 && US_STATE_CODE_TO_NAME[remainder.toUpperCase()]) {
        stateInfo = {
          code: remainder.toUpperCase(),
          name: US_STATE_CODE_TO_NAME[remainder.toUpperCase()],
        };
      }
      if (stateInfo) {
        return {
          slug: normalized,
          niche_key: niche,
          intent_type: intent,
          target_city: null,
          target_state: stateInfo.name,
          state_slug: stateInfo.name.toLowerCase().replace(/\s+/g, '-'),
          region: `US-${stateInfo.code}`,
          h1_heading: `${NICHE_TITLES[niche]} ${INTENT_NOUNS[intent]} in ${stateInfo.name} (${stateInfo.code})`,
          related_city_pages: [],
          related_state_pages: [
            { slug: `${niche}-${intent}-california`, title: `${NICHE_TITLES[niche]} in California` },
            { slug: `${niche}-${intent}-texas`, title: `${NICHE_TITLES[niche]} in Texas` },
            { slug: `${niche}-${intent}-florida`, title: `${NICHE_TITLES[niche]} in Florida` },
            { slug: `${niche}-${intent}-new-york`, title: `${NICHE_TITLES[niche]} in New York` },
          ],
          page_type: 'state',
        };
      }

      // Universal fallback for any remainder with this niche & intent
      if (remainder) {
        const placeName = remainder
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return {
          slug: normalized,
          niche_key: niche,
          intent_type: intent,
          target_city: placeName,
          target_state: 'United States',
          state_slug: 'united-states',
          region: 'US',
          h1_heading: `${NICHE_TITLES[niche]} ${INTENT_NOUNS[intent]} in ${placeName}`,
          related_city_pages: [
            { slug: `${niche}-wholesaler-${remainder}`, title: `${NICHE_TITLES[niche]} Wholesaler in ${placeName}` },
            { slug: `${niche}-supplier-${remainder}`, title: `${NICHE_TITLES[niche]} Supplier in ${placeName}` },
            { slug: `${niche}-manufacturer-${remainder}`, title: `${NICHE_TITLES[niche]} Manufacturer in ${placeName}` },
            { slug: `${niche}-importer-${remainder}`, title: `${NICHE_TITLES[niche]} Importer in ${placeName}` },
          ],
          related_state_pages: [
            { slug: `${niche}-${intent}-california`, title: `${NICHE_TITLES[niche]} in California` },
            { slug: `${niche}-${intent}-texas`, title: `${NICHE_TITLES[niche]} in Texas` },
            { slug: `${niche}-${intent}-florida`, title: `${NICHE_TITLES[niche]} in Florida` },
            { slug: `${niche}-${intent}-new-york`, title: `${NICHE_TITLES[niche]} in New York` },
          ],
          page_type: 'city',
        };
      }
    }
  }

  return null;
}

export function useStaticPage(slug: string) {
  return useQuery<StaticPage>({
    queryKey: ["static-page", slug],
    queryFn: async () => {
      try {
        const res = await fetch(`/pages/${slug}.json`);
        if (res.ok) {
          return await res.json();
        }
      } catch {
        // Fallback to dynamic synthesis below
      }

      const synthesized = synthesizePageFromSlug(slug);
      if (synthesized) {
        return synthesized;
      }

      throw new Error(`Page not found: ${slug}`);
    },
    enabled: !!slug,
    staleTime: Infinity,
    retry: false,
  });
}
