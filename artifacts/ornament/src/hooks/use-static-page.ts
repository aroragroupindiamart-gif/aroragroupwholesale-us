/**
 * Fetches page data from the pre-generated /pages/{slug}.json static file.
 * Zero runtime API needed — works on any static host (Netlify, Vercel, etc.).
 */
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
  related_city_pages: { slug: string; title: string }[];
  related_state_pages: { slug: string; title: string }[];
};

export function useStaticPage(slug: string) {
  return useQuery<StaticPage>({
    queryKey: ["static-page", slug],
    queryFn: async () => {
      const res = await fetch(`/pages/${slug}.json`);
      if (!res.ok) throw new Error(`Page not found: ${slug}`);
      return res.json();
    },
    enabled: !!slug,
    staleTime: Infinity,
    retry: false,
  });
}
