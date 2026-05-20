import { useParams, Link } from "wouter";
import { useGetPage } from "@workspace/api-client-react";
import { ArrowLeft, MapPin, Phone, CheckCircle, Star, Shield, TrendingUp } from "lucide-react";
import NotFound from "@/pages/not-found";

const WHATSAPP_NUMBER = "919999999999";

const NICHE_DESCRIPTIONS: Record<string, string> = {
  "gold-jewelry": "gold jewelry",
  "silver-jewelry": "silver jewelry",
  "diamond-jewelry": "diamond jewelry",
  "artificial-jewelry": "artificial & imitation jewelry",
  "bridal-jewelry": "bridal & wedding jewelry",
  "fashion-jewelry": "fashion & costume jewelry",
};

const INTENT_DESCRIPTIONS: Record<string, { verb: string; noun: string; plural: string }> = {
  wholesaler: { verb: "wholesale", noun: "wholesaler", plural: "wholesalers" },
  supplier: { verb: "supply", noun: "supplier", plural: "suppliers" },
  manufacturer: { verb: "manufacture", noun: "manufacturer", plural: "manufacturers" },
  importer: { verb: "import", noun: "importer", plural: "importers" },
};

function formatPageTitle(niche: string, intent: string, city: string | null, state: string) {
  const nd = NICHE_DESCRIPTIONS[niche] ?? niche;
  const id = INTENT_DESCRIPTIONS[intent];
  if (!id) return city ? `${nd} in ${city}` : `${nd} in ${state}`;
  if (city) return `${nd} ${id.plural} in ${city}, ${state}`;
  return `${nd} ${id.plural} across ${state}`;
}

function WATriggerBtn({ niche, intent, location, className = "" }: {
  niche: string; intent: string; location: string; className?: string;
}) {
  const nd = NICHE_DESCRIPTIONS[niche] ?? niche;
  const id = INTENT_DESCRIPTIONS[intent];
  const msg = `Hello, I'm looking for a trusted ${nd} ${id?.noun ?? intent} in ${location}. Please share your catalogue and pricing.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="btn-whatsapp-cta"
      className={`inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c05c] text-white font-bold rounded-xl transition-colors shadow-lg ${className}`}
    >
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Connect on WhatsApp
    </a>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="h-16 bg-card border-b border-border" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-5 w-48 bg-muted rounded mb-6" />
        <div className="h-10 w-3/4 bg-muted rounded mb-3" />
        <div className="h-6 w-1/2 bg-muted rounded mb-8" />
        <div className="h-20 bg-muted rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 bg-muted rounded" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, isError } = useGetPage(slug ?? "", {
    query: { enabled: !!slug },
  });

  if (isLoading) return <PageSkeleton />;
  if (isError || !page) return <NotFound />;

  const locationLabel = page.target_city ?? page.target_state;
  const nd = NICHE_DESCRIPTIONS[page.niche_key] ?? page.niche_key;
  const id = INTENT_DESCRIPTIONS[page.intent_type];
  const waMsg = `Hello, I need a verified ${nd} ${id?.noun ?? page.intent_type} in ${locationLabel}. Please share your catalogue.`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── NAV ─────────────────────────────────────────────── */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" data-testid="link-home-logo" className="font-serif text-2xl font-bold text-primary tracking-tight">
            Ornament
          </Link>
          <WATriggerBtn niche={page.niche_key} intent={page.intent_type} location={locationLabel} className="text-sm px-4 py-2" />
        </div>
      </header>

      {/* ─── BREADCRUMB ──────────────────────────────────────── */}
      <div className="bg-muted/40 border-b border-border py-2">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors" data-testid="breadcrumb-home">Home</Link>
          <span>/</span>
          <Link href={`/gold-jewelry-wholesaler-${page.target_state.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors capitalize" data-testid="breadcrumb-state">
            {page.target_state}
          </Link>
          {page.target_city && (
            <>
              <span>/</span>
              <span className="text-foreground capitalize" data-testid="breadcrumb-city">{page.target_city}</span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground capitalize" data-testid="breadcrumb-niche">{page.niche_key.replace(/-/g, " ")}</span>
        </nav>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── MAIN CONTENT ──────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Hero heading */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                <MapPin className="w-3 h-3" />
                {page.region} India
              </span>
              <h1
                className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3"
                data-testid="heading-h1"
              >
                {page.h1_heading}
              </h1>
              <p className="text-muted-foreground text-base">
                Looking for a reliable <strong>{nd} {id?.noun ?? page.intent_type}</strong> in{" "}
                <strong>{locationLabel}</strong>? Connect directly with verified B2B partners
                who offer bulk pricing, quality assurance, and fast dispatch.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: CheckCircle, label: "Verified B2B" },
                { icon: Shield, label: "Quality Assured" },
                { icon: TrendingUp, label: "Bulk Pricing" },
                { icon: Star, label: "Wholesale Rates" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
              ))}
            </div>

            {/* WhatsApp CTA (inline) */}
            <div className="bg-[#25D366]/8 border border-[#25D366]/30 rounded-2xl p-6 mb-8">
              <h2 className="font-semibold text-foreground mb-1 text-lg">
                Connect with {formatPageTitle(page.niche_key, page.intent_type, page.target_city, page.target_state)}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Send your requirements on WhatsApp — get catalogue, MOQ, and pricing within minutes.
              </p>
              <WATriggerBtn
                niche={page.niche_key}
                intent={page.intent_type}
                location={locationLabel}
                className="px-6 py-3 text-base"
              />
            </div>

            {/* Content section 1 */}
            <section className="prose prose-sm max-w-none mb-8">
              <h2 className="font-serif text-xl font-bold text-foreground not-prose mb-3">
                Why Source {nd.charAt(0).toUpperCase() + nd.slice(1)} from {locationLabel}?
              </h2>
              <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                <p>
                  {locationLabel} is a well-established hub for B2B{" "}
                  {page.intent_type === "importer" ? "jewelry importers" : `jewelry ${id?.plural ?? page.intent_type}`}{" "}
                  in the {page.region} India region. Retailers, boutiques, and traders across the country
                  source {nd} from {locationLabel} to benefit from competitive pricing,
                  diverse designs, and reliable supply chains.
                </p>
                <p>
                  Whether you're looking to place a one-time bulk order or establish a long-term
                  wholesale relationship, our verified {nd} {id?.plural ?? page.intent_type} in{" "}
                  {locationLabel} offer flexible MOQs, customisation options, and both branded
                  and unbranded {nd} collections.
                </p>
              </div>
            </section>

            {/* Content section 2 */}
            <section className="mb-8">
              <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                What to Expect from Our {nd.charAt(0).toUpperCase() + nd.slice(1)} {id?.plural.charAt(0).toUpperCase()}{id?.plural.slice(1) ?? "Partners"} in {locationLabel}
              </h2>
              <ul className="space-y-2">
                {[
                  `Direct factory or importer pricing — no middlemen`,
                  `Wide range of designs including traditional, contemporary, and fusion styles`,
                  `Flexible minimum order quantities (MOQ) for all business sizes`,
                  `Pan-India shipping and B2B invoice support for GST-registered buyers`,
                  `WhatsApp-first communication for fast quotations and sample requests`,
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Phone CTA */}
            <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Need to speak directly?</p>
                <p className="text-xs text-muted-foreground">WhatsApp us your requirements and we'll connect you with the right {id?.noun ?? "partner"}.</p>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="btn-whatsapp-phone"
                className="text-sm font-semibold text-primary hover:underline shrink-0"
              >
                Chat Now →
              </a>
            </div>

            {/* Related city pages */}
            {page.related_city_pages.length > 0 && (
              <section className="mb-8">
                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-widest text-muted-foreground">
                  Also Available in Nearby Cities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {page.related_city_pages.map((link) => (
                    <Link
                      key={link.slug}
                      href={`/${link.slug}`}
                      data-testid={`link-related-city-${link.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary hover:bg-accent px-3 py-2 rounded-lg border border-border transition-colors truncate"
                    >
                      {link.title.split("|")[0].trim()}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related state pages */}
            {page.related_state_pages.length > 0 && (
              <section className="mb-4">
                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-widest text-muted-foreground">
                  Browse by State
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {page.related_state_pages.map((link) => (
                    <Link
                      key={link.slug}
                      href={`/${link.slug}`}
                      data-testid={`link-related-state-${link.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary hover:bg-accent px-3 py-2 rounded-lg border border-border transition-colors truncate"
                    >
                      {link.title.split("|")[0].trim()}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <Link
              href="/"
              data-testid="link-back-home"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* ─── SIDEBAR ───────────────────────────────────── */}
          <div className="space-y-4">
            {/* Primary CTA card */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg">
              <h3 className="font-serif text-xl font-bold mb-2">
                Source {nd.charAt(0).toUpperCase() + nd.slice(1)} in {locationLabel}
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Talk to verified {id?.plural ?? "partners"} now. Free consultation.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="btn-whatsapp-sidebar"
                className="flex items-center justify-center gap-2 bg-white text-primary font-bold px-4 py-3 rounded-xl w-full hover:bg-white/90 transition-colors text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Now
              </a>
            </div>

            {/* Page info card */}
            <div className="bg-card border border-border rounded-xl p-5 text-sm space-y-3">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-widest text-muted-foreground">Page Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground capitalize">{nd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground capitalize">{id?.noun ?? page.intent_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground">{locationLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">State</span>
                  <span className="font-medium text-foreground">{page.target_state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium text-foreground">{page.region}</span>
                </div>
              </div>
            </div>

            {/* Intent selector */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-widest text-muted-foreground mb-3">Looking For</h4>
              <div className="space-y-1.5">
                {["wholesaler", "supplier", "manufacturer", "importer"].map((intent) => {
                  const targetSlug = `${page.niche_key}-${intent}-${(page.target_city ?? page.target_state).toLowerCase().replace(/\s+/g, '-')}`;
                  const isActive = page.intent_type === intent;
                  return (
                    <Link
                      key={intent}
                      href={`/${targetSlug}`}
                      data-testid={`link-intent-switch-${intent}`}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
      <footer className="border-t border-border bg-card py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-serif text-lg font-bold text-primary">Ornament</Link>
          <p className="text-xs text-muted-foreground text-center">
            India's B2B Jewelry Wholesale Directory — Connecting Buyers &amp; Sellers
          </p>
          <p className="text-xs text-muted-foreground">© 2024 Ornament. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
