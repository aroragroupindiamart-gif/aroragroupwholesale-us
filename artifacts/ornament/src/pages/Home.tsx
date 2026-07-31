import { useState, useRef } from "react";
import { Link } from "wouter";
import { BRAND_NAME, WHATSAPP_NUMBER, NICHE_ICONS, NICHE_DISPLAY, FOUNDER_VIDEO_ID, REVIEWS, TOP_BANNER, HERO_BADGE, HERO_TITLE, HERO_DESCRIPTION } from "@/lib/brandConfig";
import { STATES } from "@/lib/staticData";
import SiteFooter from "@/components/SiteFooter";
import { useCitySearch } from "@/hooks/use-city-search";

const WHATSAPP_MSG = `Hi ${BRAND_NAME}, I'm a retailer interested in direct factory wholesale supply. Please send me your catalogue and pricing.`;

const REGION_ORDER = ["North", "South", "West", "East", "Central", "North-East"];

const INTENT_LABELS = [
  { key: "wholesaler", label: "Wholesaler" },
  { key: "supplier", label: "Supplier" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "importer", label: "Importer" },
];

function WhatsAppButton({ className = "" }: { className?: string }) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="btn-whatsapp-hero"
      className={`inline-flex items-center gap-2 bg-[#FFC629] hover:bg-[#e6b325] text-[#1E1E1E] font-bold px-6 py-3 rounded-lg transition-colors shadow-md ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      WhatsApp Inquiry
    </a>
  );
}

const NICHES = Object.entries(NICHE_DISPLAY).map(([niche_key, display_name]) => ({ niche_key, display_name }));
const STATES_BY_REGION = REGION_ORDER.map((region) => ({
  region,
  states: STATES.filter((s) => s.region === region),
})).filter((g) => g.states.length > 0);

export default function Home() {
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState({ name: "New Delhi", slug: "new-delhi" });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { results: cityResults, isLoading: citiesLoading } = useCitySearch(cityQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1E1E1E]">
      {/* ─── TOP BANNER ──────────────────────────────────────── */}
      <div className="bg-[#1E1E1E] text-[#FFC629] text-center text-xs sm:text-sm font-semibold py-2.5 px-4">
        {TOP_BANNER}
      </div>

      {/* ─── NAV ─────────────────────────────────────────────── */}
      <header className="border-b border-amber-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" data-testid="link-home-logo">
            <img src="/arora-group-logo.png" alt={BRAND_NAME} className="h-12 w-auto" />
          </Link>
          <WhatsAppButton className="text-sm px-4 py-2" />
        </div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-amber-50 via-[#FFF8F0] to-[#FFF8F0] py-16 sm:py-24 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#1E1E1E] mb-4 bg-[#FFC629]/20 px-3 py-1 rounded-full border border-[#FFC629]/30">
            {HERO_BADGE}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E1E1E] leading-tight mb-6">
            {HERO_TITLE}
          </h1>
          <p className="text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto mb-8">
            {HERO_DESCRIPTION}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <WhatsAppButton className="text-base px-8 py-3.5" />
            <a
              href="#product-lines"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-[#1E1E1E] font-semibold px-8 py-3.5 rounded-lg transition-colors border border-amber-200"
              data-testid="link-browse-niches"
            >
              Our Product Lines
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-[#1E1E1E]/60">
            <span className="flex items-center gap-1.5">✓ <strong className="text-[#1E1E1E]">3,792</strong> pages</span>
            <span className="flex items-center gap-1.5">✓ <strong className="text-[#1E1E1E]">122</strong> cities</span>
            <span className="flex items-center gap-1.5">✓ <strong className="text-[#1E1E1E]">36</strong> states &amp; UTs</span>
            <span className="flex items-center gap-1.5">✓ <strong className="text-[#1E1E1E]">6</strong> product lines</span>
            <span className="flex items-center gap-1.5">✓ MOV <strong className="text-[#1E1E1E]">₹3,000</strong></span>
          </div>
        </div>
      </section>

      {/* ─── FOUNDER VIDEO ───────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E] mb-2">
            Meet the Founder — See the Collection Live
          </h2>
          <p className="text-[#1E1E1E]/60 mb-6 text-sm max-w-xl mx-auto">
            Watch {BRAND_NAME}'s founder walk through the full trending jewellery range — the same collections available for direct wholesale to your business.
          </p>
          <div className="relative w-full rounded-xl overflow-hidden shadow-lg" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${FOUNDER_VIDEO_ID}`}
              title={`${BRAND_NAME} — Founder Product Showcase`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─────────────────────────────────────────── */}
      <section className="py-14 bg-[#FFF8F0] border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[#FFC629] text-xl tracking-wider">★★★★★</span>
              <span className="font-serif text-2xl font-bold text-[#1E1E1E]">5.0</span>
            </div>
            <p className="text-[#1E1E1E]/50 text-xs uppercase tracking-widest mb-2">10 Google Reviews · Verified Retailers</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1E1E]">What Business Owners Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm flex flex-col gap-3">
                <span className="text-[#FFC629] tracking-wider text-sm">★★★★★</span>
                <p className="text-sm text-[#1E1E1E]/65 leading-relaxed italic flex-1">"{r.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-[#1E1E1E]">{r.name}</p>
                  <p className="text-xs text-[#1E1E1E]/45">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT LINES ───────────────────────────────────── */}
      <section id="product-lines" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl font-bold text-[#1E1E1E] text-center mb-2">
          Our 6 Specialised Product Lines
        </h2>
        <p className="text-[#1E1E1E]/60 text-center mb-8">
          Each line manufactured in-house with certified purity standards — available for direct wholesale across India
        </p>

        {/* ── City search widget ── */}
        <div className="max-w-sm mx-auto mb-10 relative">
          <label htmlFor="city-search" className="block text-sm font-medium text-[#1E1E1E]/70 text-center mb-2">
            Find suppliers in your city
          </label>
          <div className="relative">
            <input
              id="city-search"
              ref={inputRef}
              type="text"
              autoComplete="off"
              value={cityQuery}
              placeholder={selectedCity.name}
              onChange={(e) => { setCityQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => { if (cityQuery) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full border border-amber-300 rounded-xl px-4 py-2.5 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC629] placeholder-[#1E1E1E]/40"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30 pointer-events-none text-base">
              {citiesLoading ? "⏳" : "🔍"}
            </span>
            {showSuggestions && cityResults.length > 0 && (
              <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-amber-200 rounded-xl shadow-lg overflow-hidden">
                {cityResults.map((c) => (
                  <li key={c.city_slug}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 text-[#1E1E1E] transition-colors"
                      onMouseDown={() => {
                        setSelectedCity({ name: c.city_name, slug: c.city_slug });
                        setCityQuery("");
                        setShowSuggestions(false);
                        inputRef.current?.blur();
                      }}
                    >
                      {c.city_name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-xs text-center text-[#1E1E1E]/40 mt-2">
            Showing results for{" "}
            <strong className="text-[#1E1E1E]/60">{selectedCity.name}</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {NICHES.map((niche) => {
              const icon = NICHE_ICONS[niche.niche_key] ?? "💍";
              const exampleSlug = `${niche.niche_key}-wholesaler-${selectedCity.slug}`;
              return (
                <Link
                  key={niche.niche_key}
                  href={`/${exampleSlug}`}
                  data-testid={`card-niche-${niche.niche_key}`}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-amber-200 bg-white hover:border-[#FFC629] hover:shadow-md transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFC629]/15 flex items-center justify-center group-hover:bg-[#FFC629]/30 transition-colors text-2xl">
                    {icon}
                  </div>
                  <span className="text-sm font-semibold text-[#1E1E1E] leading-snug">
                    {niche.display_name}
                  </span>
                </Link>
              );
            })}
          </div>

        {/* Supply type sub-links */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {INTENT_LABELS.map((intent) => (
            <Link
              key={intent.key}
              href={`/korean-jewellery-${intent.key}-${selectedCity.slug}`}
              data-testid={`link-intent-${intent.key}`}
              className="px-4 py-1.5 rounded-full border border-amber-200 bg-white text-sm text-[#1E1E1E]/60 hover:border-[#FFC629] hover:text-[#1E1E1E] transition-colors"
            >
              {intent.label}s
            </Link>
          ))}
        </div>
      </section>

      {/* ─── STATE COVERAGE GRID ─────────────────────────────── */}
      <section className="py-16 bg-white border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-[#1E1E1E] text-center mb-2">
            State-Level Supply Coverage
          </h2>
          <p className="text-[#1E1E1E]/60 text-center mb-10">
            {BRAND_NAME} dispatches direct to retailers across all 36 Indian states and union territories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {STATES_BY_REGION.map(({ region, states: regionStates }) => (
                <div key={region} className="bg-[#FFF8F0] border border-amber-200 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFC629] mb-3 bg-[#1E1E1E] inline-block px-2 py-0.5 rounded">
                    {region} India
                  </h3>
                  <ul className="space-y-1 mt-2">
                    {regionStates.map((s) => (
                      <li key={s.state_slug}>
                        <Link
                          href={`/korean-jewellery-wholesaler-${s.state_slug}`}
                          data-testid={`link-state-${s.state_slug}`}
                          className="text-sm text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:underline transition-colors"
                        >
                          {s.state_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* ─── B2B TRUST ───────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🌐", title: "Direct Global Importing", desc: "No trading middlemen or agent markups. We source directly from international jewelry hubs at true factory-floor pricing." },
            { icon: "💧", title: "100% Tarnish-Free Guarantee", desc: "Engineered for heavy daily wear. Completely waterproof protective layers that will not fade, turn green, or oxidize." },
            { icon: "📈", title: "Pinterest & Reel Trending", desc: "We scout and source hyper-viral social media jewelry aesthetics so your store captures hot consumer trends before they fade." },
            { icon: "🛒", title: "Flexible Small-Batch Sourcing", desc: "Zero item-level MOQ. Mix and match any assortment of rings, anklets, or necklaces. MOV just ₹3,000." },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-[#1E1E1E] mb-2 text-sm">{item.title}</h3>
              <p className="text-xs text-[#1E1E1E]/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────────── */}
      <section className="bg-[#1E1E1E] py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-3">
            Ready to Source Direct from <span className="text-[#FFC629]">{BRAND_NAME}</span>?
          </h2>
          <p className="text-white/60 mb-6">
            Minimum Order Value: ₹3,000 · No Item MOQ · GST Invoice · Insured Freight · Purity Certified
          </p>
          <WhatsAppButton className="text-base px-10 py-4 text-lg" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
