import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { BRAND_NAME, WHATSAPP_NUMBER, SITE_URL, FOUNDER_VIDEO_ID } from "@/lib/brandConfig";
import { ALL_US_STATES } from "@/lib/staticData";
import SiteFooter from "@/components/SiteFooter";

interface CityItem {
  id?: number;
  place_name: string;
  place_slug: string;
  state_code: string;
  population?: number;
  tier?: number;
}

interface StateDirectoryProps {
  slug: string;
}

const WA_ICON = (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function StateDirectory({ slug }: StateDirectoryProps) {
  const normalizedSlug = slug.toLowerCase();
  const state = ALL_US_STATES.find(
    (s) =>
      s.state_code?.toLowerCase() === normalizedSlug ||
      s.state_slug === normalizedSlug ||
      `korean-jewellery-wholesaler-${s.state_slug}` === normalizedSlug
  );

  const [cities, setCities] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const stateName = state ? state.state_name : "United States";
  const stateCode = state?.state_code || "";
  const cityCount = state?.count || cities.length;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Arora Group Wholesale, I am a business owner in ${stateName}. Send me your latest B2B catalog of trending jewellery.`
  )}`;

  useEffect(() => {
    if (!state) return;

    document.title = `Wholesale Jewellery in ${stateName} | ${BRAND_NAME}`;

    fetch(`/pages/${state.state_code?.toLowerCase()}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (data.cities) {
          setCities(data.cities);
        }
      })
      .catch(() => {
        // Fallback: fetch cities.json
        fetch("/cities.json")
          .then((r) => r.json())
          .then((allCities: any[]) => {
            const filtered = allCities
              .filter(
                (c) =>
                  c.state_code === state.state_code ||
                  c.state_name?.toLowerCase() === stateName.toLowerCase()
              )
              .sort((a, b) => (b.population || 0) - (a.population || 0));
            setCities(filtered);
          })
          .catch(() => {});
      })
      .finally(() => setLoading(false));
  }, [state, stateName]);

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="bg-[#080D1A] border-b border-slate-800 text-[#FFC629] text-center text-xs font-semibold py-2 px-4">
        Direct Importer, Exporter &amp; Wholesale Supplier of Anti-Tarnish, 18K Gold Plated &amp; Korean Jewellery to {stateName} · Low $100 MOV
      </div>

      {/* Header */}
      <header className="bg-[#080D1A] border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <img src="/arora-group-logo.png" alt={BRAND_NAME} className="h-10 w-auto bg-white/10 rounded px-2 py-1" />
          </Link>
          <div className="flex items-center gap-6">
            <a href="/#states" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              All States
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFC629] hover:bg-[#e6b325] text-slate-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-colors"
            >
              {WA_ICON}
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Local Jewellery Wholesalers in {stateName}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed mb-6">
          Direct B2B wholesale importer, exporter, and supplier of waterproof anti-tarnish, 18K gold-plated, and Korean jewellery across {cityCount} cities in {stateName}. Fast 4–7 day express air delivery via DHL &amp; FedEx · Low $100 USD MOV · Zero item MOQ.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#FFC629] hover:bg-[#e6b325] text-slate-950 font-bold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-lg"
        >
          {WA_ICON}
          WhatsApp Catalog &amp; MOV
        </a>
      </section>

      {/* Cities Section — 5 Column Card Grid Matching hongdaplumbing.com */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            Cities in {stateName}
          </h2>
          <p className="text-sm text-slate-400">
            {cityCount} cities with direct wholesale jewellery supply
          </p>
        </div>

        {loading && cities.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-900/60 border border-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {cities.map((loc) => {
              const citySlug = `korean-jewellery-wholesaler-${loc.place_slug}-${(loc.state_code || stateCode).toLowerCase()}`;
              return (
                <a
                  key={loc.place_slug}
                  href={`/${citySlug}`}
                  className="flex flex-col justify-center p-3.5 bg-[#111827] border border-[#1F2937] hover:border-slate-500 hover:bg-[#1E293B] rounded-lg transition-all text-left group"
                >
                  <span className="text-[15px] font-semibold text-slate-100 group-hover:text-white truncate">
                    {loc.place_name}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Pop. {(loc.population || 0).toLocaleString('en-US')} · Tier {loc.tier || 1}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* B2B Trust Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="font-semibold text-white text-sm mb-1">Direct Importer &amp; Exporter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">No middlemen or trading markups. Direct B2B supplier connecting {stateName} retailers with factory-floor pricing.</p>
          </div>
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
            <div className="text-2xl mb-2">💧</div>
            <h3 className="font-semibold text-white text-sm mb-1">100% Anti-Tarnish Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Engineered for heavy daily wear. Completely waterproof protective layers that never turn green or oxidize.</p>
          </div>
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-white text-sm mb-1">Pinterest &amp; Reel Trending</h3>
            <p className="text-xs text-slate-400 leading-relaxed">We curate hyper-viral social media jewelry aesthetics so your boutique captures trending consumer demand.</p>
          </div>
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
            <div className="text-2xl mb-2">🛒</div>
            <h3 className="font-semibold text-white text-sm mb-1">Low $100 MOV · Zero Item MOQ</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Mix and match any rings, necklaces, or bracelets freely. Express 4–7 day DHL &amp; FedEx air delivery to {stateName}.</p>
          </div>
        </div>
      </section>

      {/* Founder Video Showcase */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Meet the Founder — See the Collection Live
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
          Watch {BRAND_NAME}'s founder walk through the full trending jewellery range available for direct wholesale to {stateName} retailers.
        </p>
        <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-slate-800" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${FOUNDER_VIDEO_ID}`}
            title={`${BRAND_NAME} — Founder Product Showcase`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>

      {/* All States Quick Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-800/80">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFC629] mb-4">
          All 50 US States Wholesale Coverage
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {ALL_US_STATES.map((s) => (
            <a
              key={s.state_slug}
              href={`/${s.state_code ? s.state_code.toLowerCase() : s.state_slug}`}
              className="text-xs text-slate-400 hover:text-[#FFC629] transition-colors truncate"
            >
              {s.state_name} ({s.count})
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
