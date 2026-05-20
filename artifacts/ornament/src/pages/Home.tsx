import { Link } from "wouter";
import { useListNiches, useListStates } from "@workspace/api-client-react";
import { Gem, Sparkles, Layers, Star, Zap, Globe } from "lucide-react";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "919999999999";
const WHATSAPP_MSG = "Hi Arora Group Wholesale, I am a commercial buyer inquiring about direct factory supply for our business.";

const NICHE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "korean-jewellery":          Star,
  "fashion-jewellery":         Sparkles,
  "anti-tarnish-jewellery":    Layers,
  "18k-gold-plated-jewellery": Gem,
  "demi-fine-jewellery":       Zap,
  "western-jewellery":         Globe,
};

const INTENT_LABELS = [
  { key: "wholesaler", label: "Wholesaler" },
  { key: "supplier", label: "Supplier" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "importer", label: "Importer" },
];

const REGION_ORDER = ["North", "South", "West", "East", "Central", "North-East"];

function WhatsAppButton({ className = "" }: { className?: string }) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="btn-whatsapp-hero"
      className={`inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20c05c] text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
}

export default function Home() {
  const { data: niches, isLoading: nichesLoading } = useListNiches();
  const { data: states, isLoading: statesLoading } = useListStates();

  const statesByRegion = REGION_ORDER.map((region) => ({
    region,
    states: (states ?? []).filter((s) => s.region === region),
  })).filter((g) => g.states.length > 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── NAV ─────────────────────────────────────────────── */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" data-testid="link-home-logo">
            <span className="font-serif text-xl font-bold text-primary tracking-tight">
              Arora Group Wholesale
            </span>
          </Link>
          <WhatsAppButton className="text-sm px-4 py-2" />
        </div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-amber-50 via-background to-background py-16 sm:py-24 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4 bg-primary/10 px-3 py-1 rounded-full">
            Direct Factory Supply — India
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Direct Factory Jewelry Supply{" "}
            <span className="text-primary">for Indian Retailers &amp; Resellers</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Arora Group Wholesale operates mass-import sourcing pipelines and custom manufacturing
            capabilities across all 6 product segments. We deliver door-to-door insured air cargo
            with end-to-end shipment tracking to all 122 commercial regions across India — eliminating
            every intermediate distributor markup between our factory floor and your storefront.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <WhatsAppButton className="text-base px-8 py-3.5" />
            <a
              href="#product-lines"
              className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-8 py-3.5 rounded-lg transition-colors border border-border"
              data-testid="link-browse-niches"
            >
              Browse Product Lines
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">✓ <strong className="text-foreground">3,792</strong> supply pages</span>
            <span className="flex items-center gap-1.5">✓ <strong className="text-foreground">122</strong> commercial regions</span>
            <span className="flex items-center gap-1.5">✓ <strong className="text-foreground">36</strong> states &amp; UTs</span>
            <span className="flex items-center gap-1.5">✓ <strong className="text-foreground">6</strong> product lines</span>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT LINES ───────────────────────────────────── */}
      <section id="product-lines" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-2">
          Our 6 Product Lines
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Source directly from Arora Group Wholesale manufacturing infrastructure
        </p>
        {nichesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(niches ?? []).map((niche) => {
              const Icon = NICHE_ICONS[niche.niche_key] ?? Gem;
              const defaultIntent = "wholesaler";
              const exampleSlug = `${niche.niche_key}-${defaultIntent}-jaipur`;
              return (
                <Link
                  key={niche.niche_key}
                  href={`/${exampleSlug}`}
                  data-testid={`card-niche-${niche.niche_key}`}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground leading-snug">
                    {niche.display_name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Intent sub-links */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {INTENT_LABELS.map((intent) => (
            <Link
              key={intent.key}
              href={`/korean-jewellery-${intent.key}-jaipur`}
              data-testid={`link-intent-${intent.key}`}
              className="px-4 py-1.5 rounded-full border border-border text-sm text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors"
            >
              {intent.label}s
            </Link>
          ))}
        </div>
      </section>

      {/* ─── STATES ──────────────────────────────────────────── */}
      <section className="py-16 bg-muted/40 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-2">
            Browse by State
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Arora Group Wholesale ships factory-direct to every Indian state and union territory
          </p>
          {statesLoading ? (
            <div className="h-48 bg-card animate-pulse rounded-xl" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statesByRegion.map(({ region, states: regionStates }) => (
                <div key={region} className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    {region} India
                  </h3>
                  <ul className="space-y-1">
                    {regionStates.map((s) => (
                      <li key={s.state_slug}>
                        <Link
                          href={`/korean-jewellery-wholesaler-${s.state_slug}`}
                          data-testid={`link-state-${s.state_slug}`}
                          className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                        >
                          {s.state_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── TRUST ───────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: "🏭", title: "Factory-Direct Pricing", desc: "No intermediary markups. Source directly from Arora Group's own manufacturing and import infrastructure." },
            { icon: "✈️", title: "Insured Air Cargo Tracking", desc: "Door-to-door insured air cargo with full end-to-end shipment tracking to all 122 commercial regions." },
            { icon: "💬", title: "Instant WhatsApp Access", desc: "One message to open a direct supply chain account with Arora Group — no sign-up, no delay." },
          ].map((item) => (
            <div key={item.title} className="bg-card border border-border rounded-xl p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────────── */}
      <section className="bg-primary/10 border-t border-primary/20 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
            Open a Direct Supply Account with Arora Group
          </h2>
          <p className="text-muted-foreground mb-6">
            Boutique showrooms, retail merchants, and online resellers — establish your factory-direct supply chain today.
          </p>
          <WhatsAppButton className="text-base px-10 py-4 text-lg" />
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg font-bold text-primary">Arora Group Wholesale</span>
          <p className="text-xs text-muted-foreground text-center">
            Direct Factory Jewelry Supply — Serving 122 Commercial Regions Across India
          </p>
          <p className="text-xs text-muted-foreground">© 2024 Arora Group Wholesale. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
