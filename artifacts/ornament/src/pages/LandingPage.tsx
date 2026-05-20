import { useParams, Link } from "wouter";
import { useGetPage } from "@workspace/api-client-react";
import { ArrowLeft, MapPin, Factory, Truck, ShieldCheck, Layers } from "lucide-react";
import NotFound from "@/pages/not-found";
import { BRAND_NAME, WHATSAPP_NUMBER, NICHE_DISPLAY, INTENT_DISPLAY, SITE_URL } from "@/lib/brandConfig";

function getWaUrl(niche: string, city: string) {
  const nd = NICHE_DISPLAY[niche] ?? niche;
  const msg = `Hi Arora Group, I'm a retailer inquiring about direct factory supply for ${nd} for my business in ${city}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const WA_ICON = (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] animate-pulse">
      <div className="h-10 bg-[#FFC629]/30" />
      <div className="h-16 bg-white border-b" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-5 w-48 bg-amber-100 rounded mb-6" />
        <div className="h-10 w-3/4 bg-amber-100 rounded mb-3" />
        <div className="h-20 bg-amber-100 rounded-xl mb-8" />
      </div>
    </div>
  );
}

const FAQS = (niche: string, city: string) => {
  const nd = NICHE_DISPLAY[niche] ?? niche;
  return [
    {
      q: `What are the corporate purchasing terms for ${nd} from ${BRAND_NAME}?`,
      a: `${BRAND_NAME} operates on a factory-direct B2B model. Orders are processed against GST-registered business invoices with a minimum order value of ₹5,000. Payment terms include advance, 50/50, or credit terms for established wholesale accounts. All bulk orders include a formal purchase order acknowledgement and quality inspection certificate.`,
    },
    {
      q: `What metal purity certifications does ${BRAND_NAME} provide for ${nd}?`,
      a: `Every ${nd} piece from our factory carries certified metallic purity documentation. Anti-tarnish collections include a BIS-aligned coating verification, while gold-plated lines are tested for micron thickness. All certificates are issued per batch and available for retailer audit at any time.`,
    },
    {
      q: `Can ${BRAND_NAME} handle custom wholesale design processing for ${city} retailers?`,
      a: `Yes. Our design manufacturing wing accepts custom briefs, buyer-provided sketches, and OEM requests. Minimum custom order runs start at 50 pieces per SKU. Design-to-delivery lead time is 15–25 business days depending on complexity. Samples are dispatched within 5 working days upon approval of design confirmation.`,
    },
    {
      q: `How does ${BRAND_NAME} handle logistics and insurance for deliveries to ${city}?`,
      a: `All shipments to ${city} are dispatched via fully insured air freight or tracked surface courier. Packages include transit insurance up to invoice value. ${BRAND_NAME} partners with BlueDart, Delhivery, and Ecom Express for last-mile delivery. Standard delivery timelines are 3–7 working days from dispatch.`,
    },
    {
      q: `What is the minimum order value and how do I place a wholesale inquiry?`,
      a: `The minimum order value (MOV) for ${BRAND_NAME} wholesale supply is ₹5,000 per invoice. To place an inquiry, WhatsApp us your business name, GST number, required ${nd} category, and approximate quantity. Our B2B executive will respond with a catalogue, price list, and sample availability within 4 business hours.`,
    },
  ];
};

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, isError } = useGetPage(slug ?? "");

  if (isLoading) return <PageSkeleton />;
  if (isError || !page) return <NotFound />;

  const locationLabel = page.target_city ?? page.target_state;
  const nd = NICHE_DISPLAY[page.niche_key] ?? page.niche_key;
  const id = INTENT_DISPLAY[page.intent_type];
  const waUrl = getWaUrl(page.niche_key, locationLabel);
  const faqs = FAQS(page.niche_key, locationLabel);

  const otherNiches = Object.entries(NICHE_DISPLAY)
    .filter(([k]) => k !== page.niche_key)
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WholesaleStore",
        "@id": `${SITE_URL}/${page.slug}#store`,
        name: BRAND_NAME,
        description: `${BRAND_NAME} — Direct ${nd} ${id?.noun ?? page.intent_type} serving ${locationLabel}. Factory-to-retail wholesale supply with certified purity standards and insured logistics.`,
        url: `${SITE_URL}/${page.slug}`,
        telephone: `+${WHATSAPP_NUMBER}`,
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressRegion: page.target_state,
          addressLocality: page.target_city ?? page.target_state,
        },
        areaServed: locationLabel,
        priceRange: "₹₹",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: page.target_state, item: `${SITE_URL}/${page.niche_key}-${page.intent_type}-${page.state_slug}` },
          ...(page.target_city ? [{ "@type": "ListItem", position: 3, name: page.target_city, item: `${SITE_URL}/${page.slug}` }] : []),
          { "@type": "ListItem", position: page.target_city ? 4 : 3, name: nd, item: `${SITE_URL}/${page.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1E1E1E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── TOP BANNER ────────────────────────────────────────── */}
      <div className="bg-[#1E1E1E] text-[#FFC629] text-center text-xs sm:text-sm font-semibold py-2.5 px-4">
        Direct Factory-to-Retail Logistics from {BRAND_NAME} to {locationLabel} — Minimum Order Value ₹5,000
      </div>

      {/* ─── NAV ─────────────────────────────────────────────── */}
      <header className="border-b border-amber-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" data-testid="link-home-logo" className="font-serif text-xl font-bold text-[#1E1E1E] tracking-tight leading-tight">
            <span className="text-[#FFC629]">Arora</span> Group Wholesale
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="btn-whatsapp-cta"
            className="inline-flex items-center gap-2 bg-[#FFC629] hover:bg-[#e6b325] text-[#1E1E1E] font-bold text-sm px-4 py-2 rounded-lg transition-colors shadow"
          >
            {WA_ICON}
            WhatsApp Inquiry
          </a>
        </div>
      </header>

      {/* ─── BREADCRUMB ──────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 py-2">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-xs text-amber-700 flex-wrap">
          <Link href="/" className="hover:text-[#1E1E1E] transition-colors" data-testid="breadcrumb-home">Home</Link>
          <span>/</span>
          <Link href={`/${page.niche_key}-${page.intent_type}-${page.state_slug}`} className="hover:text-[#1E1E1E] transition-colors capitalize" data-testid="breadcrumb-state">
            {page.target_state}
          </Link>
          {page.target_city && (
            <>
              <span>/</span>
              <span className="text-[#1E1E1E] capitalize" data-testid="breadcrumb-city">{page.target_city}</span>
            </>
          )}
          <span>/</span>
          <span className="text-[#1E1E1E] capitalize" data-testid="breadcrumb-niche">{nd}</span>
        </nav>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── MAIN CONTENT ──────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* (a) H1 — Arora Group as direct manufacturer */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#1E1E1E] bg-[#FFC629]/20 px-3 py-1 rounded-full mb-4">
                <MapPin className="w-3 h-3" />
                {page.region} India · Direct Factory Supply
              </span>
              <h1
                className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1E1E] leading-tight mb-3"
                data-testid="heading-h1"
              >
                {page.h1_heading}
              </h1>
              <p className="text-[#1E1E1E]/70 text-base leading-relaxed">
                {BRAND_NAME} is the direct manufacturer, importer, and master supply partner for{" "}
                <strong>{nd}</strong> serving retailers and traders in <strong>{locationLabel}</strong>.
                Skip the middlemen — source factory-direct with certified purity, insured freight, and scalable custom design manufacturing.
              </p>
            </div>

            {/* (b) Sticky WhatsApp CTA */}
            <div className="bg-[#FFC629]/10 border border-[#FFC629] rounded-2xl p-6 mb-8">
              <h2 className="font-semibold text-[#1E1E1E] mb-1 text-lg">
                Inquire About {nd} — Direct from Our Factory to {locationLabel}
              </h2>
              <p className="text-sm text-[#1E1E1E]/60 mb-4">
                WhatsApp us your business requirements — get MOV, purity certificate, and a custom catalogue within 4 hours.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="btn-whatsapp-inline"
                className="inline-flex items-center gap-2.5 bg-[#FFC629] hover:bg-[#e6b325] text-[#1E1E1E] font-bold rounded-xl transition-colors shadow-md px-6 py-3 text-base"
              >
                {WA_ICON}
                WhatsApp Arora Group
              </a>
            </div>

            {/* (c) 4 B2B Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Factory, label: "Direct Factory Pricing (No Middlemen)" },
                { icon: Truck, label: `Fully Insured Air Freight to ${locationLabel}` },
                { icon: ShieldCheck, label: "Certified Metallic & Anti-Tarnish Purity Standards" },
                { icon: Layers, label: "Scalable Custom Design Manufacturing" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-3 bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-[#FFC629]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5 text-[#1E1E1E]" />
                  </div>
                  <span className="text-xs font-semibold text-[#1E1E1E] leading-snug">{label}</span>
                </div>
              ))}
            </div>

            {/* (d) Manufacturing paragraph */}
            <section className="mb-6">
              <h2 className="font-serif text-xl font-bold text-[#1E1E1E] mb-3">
                Factory-Direct {nd} Manufacturing for {locationLabel} Retailers
              </h2>
              <div className="text-[#1E1E1E]/70 space-y-3 text-sm leading-relaxed">
                <p>
                  {BRAND_NAME} operates as a vertically integrated {nd} manufacturer and {id?.noun ?? page.intent_type}, producing
                  every piece in-house with strict quality benchmarks. Our manufacturing unit handles raw material
                  procurement, electroplating, stone setting, quality inspection, and packaging under one roof —
                  enabling us to deliver factory-direct pricing to B2B buyers in {locationLabel} without any
                  distributor markup.
                </p>
                <p>
                  Whether you are a boutique retailer, a multi-outlet chain, or an e-commerce reseller in {locationLabel},
                  {BRAND_NAME} offers flexible minimum order quantities starting at ₹5,000, scalable design customisation,
                  and co-branding options for established wholesale accounts. Our {nd} catalogue covers contemporary,
                  fusion, and export-inspired designs updated each season to match retail demand trends across {page.target_state}.
                </p>
              </div>
            </section>

            {/* (e) Logistics paragraph */}
            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-[#1E1E1E] mb-3">
                Insured B2B Logistics from {BRAND_NAME} to {locationLabel}
              </h2>
              <div className="text-[#1E1E1E]/70 space-y-3 text-sm leading-relaxed">
                <p>
                  Every order dispatched to {locationLabel} is covered by full transit insurance up to invoice value.
                  {BRAND_NAME} partners with BlueDart, Delhivery, and Ecom Express for tracked, fast-delivery logistics
                  across {page.region} India. Standard delivery timelines to {locationLabel} are 3–7 working days from
                  dispatch confirmation. Enterprise accounts may qualify for dedicated freight schedules and priority
                  processing.
                </p>
                <p>
                  All shipments include a packing manifest, batch-level purity certification, and GST-compliant B2B
                  invoice. Buyers registered under GST can claim input tax credit on all wholesale purchases from
                  {BRAND_NAME}. Returns and replacements are handled within 7 days for manufacturing defects on
                  all certified {nd} lines.
                </p>
              </div>
            </section>

            {/* (f) FAQ Accordion */}
            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-[#1E1E1E] mb-4">
                Wholesale FAQ — {nd} from {BRAND_NAME}
              </h2>
              <div className="space-y-2">
                {faqs.map(({ q, a }) => (
                  <details key={q} className="group bg-white border border-amber-200 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between gap-3 cursor-pointer px-5 py-4 font-semibold text-sm text-[#1E1E1E] list-none select-none">
                      {q}
                      <span className="shrink-0 text-[#FFC629] group-open:rotate-45 transition-transform duration-200 text-xl font-bold">+</span>
                    </summary>
                    <p className="px-5 pb-5 text-sm text-[#1E1E1E]/70 leading-relaxed border-t border-amber-100 pt-3">{a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* (g) Internal linking footer */}
            <section className="mb-8">
              <h3 className="font-semibold text-[#1E1E1E]/50 text-xs uppercase tracking-widest mb-3">
                Other Arora Group Product Lines in {locationLabel}
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {otherNiches.map(([key, name]) => {
                  const targetSlug = `${key}-${page.intent_type}-${page.slug.split(`${page.niche_key}-${page.intent_type}-`)[1]}`;
                  return (
                    <Link
                      key={key}
                      href={`/${targetSlug}`}
                      className="text-xs font-medium bg-white border border-amber-200 hover:border-[#FFC629] hover:bg-[#FFC629]/10 text-[#1E1E1E] px-3 py-1.5 rounded-full transition-colors"
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>

              {page.related_city_pages.length > 0 && (
                <>
                  <h3 className="font-semibold text-[#1E1E1E]/50 text-xs uppercase tracking-widest mb-3">
                    {nd} Supply in Nearby Cities — {page.target_state}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {page.related_city_pages.slice(0, 5).map((link) => (
                      <Link
                        key={link.slug}
                        href={`/${link.slug}`}
                        data-testid={`link-related-city-${link.slug}`}
                        className="text-xs text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:bg-[#FFC629]/10 px-3 py-2 rounded-lg border border-amber-200 transition-colors truncate"
                      >
                        {link.title.split("|")[0].trim()}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </section>

            <Link
              href="/"
              data-testid="link-back-home"
              className="inline-flex items-center gap-2 text-sm text-[#1E1E1E]/50 hover:text-[#1E1E1E] transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {BRAND_NAME} Home
            </Link>
          </div>

          {/* ─── SIDEBAR ───────────────────────────────────── */}
          <div className="space-y-4">
            {/* Primary CTA */}
            <div className="bg-[#1E1E1E] text-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-serif text-xl font-bold mb-1 text-[#FFC629]">
                {nd} — {locationLabel}
              </h3>
              <p className="text-sm text-white/70 mb-4">
                Direct factory supply. MOV ₹5,000. GST invoice included.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="btn-whatsapp-sidebar"
                className="flex items-center justify-center gap-2 bg-[#FFC629] text-[#1E1E1E] font-bold px-4 py-3 rounded-xl w-full hover:bg-[#e6b325] transition-colors text-sm"
              >
                {WA_ICON}
                WhatsApp Arora Group
              </a>
            </div>

            {/* Page details */}
            <div className="bg-white border border-amber-200 rounded-xl p-5 text-sm space-y-3">
              <h4 className="font-semibold text-[#1E1E1E]/50 text-xs uppercase tracking-widest">Supply Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#1E1E1E]/60">Product Line</span>
                  <span className="font-medium text-[#1E1E1E]">{nd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1E1E1E]/60">Role</span>
                  <span className="font-medium text-[#1E1E1E] capitalize">{id?.noun ?? page.intent_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1E1E1E]/60">Serving</span>
                  <span className="font-medium text-[#1E1E1E]">{locationLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1E1E1E]/60">State</span>
                  <span className="font-medium text-[#1E1E1E]">{page.target_state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1E1E1E]/60">MOV</span>
                  <span className="font-bold text-[#1E1E1E]">₹5,000</span>
                </div>
              </div>
            </div>

            {/* Intent switcher */}
            <div className="bg-white border border-amber-200 rounded-xl p-5">
              <h4 className="font-semibold text-[#1E1E1E]/50 text-xs uppercase tracking-widest mb-3">Supply Type</h4>
              <div className="space-y-1.5">
                {["wholesaler", "supplier", "manufacturer", "importer"].map((intent) => {
                  const locationSlug = page.slug.substring(page.niche_key.length + 1 + page.intent_type.length + 1);
                  const targetSlug = `${page.niche_key}-${intent}-${locationSlug}`;
                  const isActive = page.intent_type === intent;
                  return (
                    <Link
                      key={intent}
                      href={`/${targetSlug}`}
                      data-testid={`link-intent-switch-${intent}`}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                        isActive
                          ? "bg-[#FFC629]/20 text-[#1E1E1E] font-semibold border border-[#FFC629]"
                          : "text-[#1E1E1E]/60 hover:bg-amber-50 hover:text-[#1E1E1E]"
                      }`}
                    >
                      {intent}s
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-amber-200 bg-[#1E1E1E] py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-serif text-lg font-bold text-[#FFC629]">{BRAND_NAME}</Link>
          <p className="text-xs text-white/60 text-center">
            Direct Factory-to-Retail Jewellery Supply Across India
          </p>
          <p className="text-xs text-white/40">© 2025 {BRAND_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
