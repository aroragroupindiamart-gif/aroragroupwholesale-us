import { Link } from "wouter";
import { BRAND_NAME, WHATSAPP_NUMBER, ADDRESS, PHONE, GOOGLE_MAPS_URL } from "@/lib/brandConfig";
import SiteFooter from "@/components/SiteFooter";

const WA_ICON = (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Contact() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Arora Group Wholesale, I am a boutique owner interested in your wholesale supply.")}`;

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1E1E1E]">
      <div className="bg-[#1E1E1E] text-[#FFC629] text-center text-xs sm:text-sm font-semibold py-2.5 px-4">
        🔥 Source the Season's Most Viral Jewelry Designs Direct-from-Factory Across India — MOV: ₹3,000
      </div>

      <header className="border-b border-amber-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-[#1E1E1E] tracking-tight">
            <span className="text-[#FFC629]">Arora</span> Group Wholesale
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFC629] hover:bg-[#e6b325] text-[#1E1E1E] font-bold text-sm px-4 py-2 rounded-lg transition-colors shadow"
          >
            {WA_ICON}
            WhatsApp Inquiry
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#1E1E1E]/50 hover:text-[#1E1E1E] transition-colors mb-8">
          ← Back to Home
        </Link>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E1E1E] leading-tight mb-2">
          Contact Us
        </h1>
        <p className="text-[#1E1E1E]/60 mb-10 text-base">
          We typically respond within 4 business hours.
        </p>

        <div className="space-y-4">
          <div className="bg-white border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#FFC629]/20 flex items-center justify-center shrink-0 text-xl">📍</div>
            <div>
              <h3 className="font-semibold text-[#1E1E1E] mb-1">Office Address</h3>
              <p className="text-sm text-[#1E1E1E]/70 leading-relaxed">{ADDRESS}</p>
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#FFC629]/20 flex items-center justify-center shrink-0 text-xl">📞</div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1E1E1E] mb-1">Phone &amp; WhatsApp</h3>
              <p className="text-sm text-[#1E1E1E]/70 mb-4">{PHONE}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="inline-flex items-center gap-2 bg-[#1E1E1E] text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-[#333] transition-colors"
                >
                  📞 Call Now
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FFC629] hover:bg-[#e6b325] text-[#1E1E1E] font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow"
                >
                  {WA_ICON}
                  WhatsApp Now
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#FFC629]/20 flex items-center justify-center shrink-0 text-xl">🗺️</div>
            <div>
              <h3 className="font-semibold text-[#1E1E1E] mb-1">Find Us on Google Maps</h3>
              <p className="text-sm text-[#1E1E1E]/70 mb-4">Tagore Garden Extension, New Delhi – 110027</p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1E1E1E] text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-[#333] transition-colors"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
