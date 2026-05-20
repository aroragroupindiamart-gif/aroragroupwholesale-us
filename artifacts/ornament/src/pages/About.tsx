import { Link } from "wouter";
import { BRAND_NAME, WHATSAPP_NUMBER } from "@/lib/brandConfig";
import SiteFooter from "@/components/SiteFooter";

export default function About() {
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
            WhatsApp Inquiry
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#1E1E1E]/50 hover:text-[#1E1E1E] transition-colors mb-8">
          ← Back to Home
        </Link>

        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#1E1E1E] bg-[#FFC629]/20 px-3 py-1 rounded-full border border-[#FFC629]/30 mb-4">
          Our Story · 5 Years of Trend-Scouting
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E1E1E] leading-tight mb-8">
          About {BRAND_NAME}
        </h1>

        <div className="bg-white border border-amber-200 rounded-2xl p-8 shadow-sm mb-8">
          <p className="text-lg text-[#1E1E1E]/80 leading-relaxed">
            Five years ago, from a tiny room in Delhi, Mayank began Arora Group Wholesale with one
            stubborn belief: Indian boutique owners deserve the same trending jewelry their customers
            already love online — without the middlemen markups. He would wake before dawn, scouring
            global markets for designs going viral on Instagram and Pinterest. Today, we supply
            retailers across all 36 Indian states. The room got bigger. The team grew. But the same
            obsession — finding your next bestselling piece before anyone else does — never changed.{" "}
            <strong>This is still a family. And you are part of it.</strong>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { stat: "5+", label: "Years in Business" },
            { stat: "36", label: "States Served" },
            { stat: "₹3,000", label: "Min. Order Value" },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm text-center">
              <p className="font-serif text-2xl font-bold text-[#FFC629]">{stat}</p>
              <p className="text-xs text-[#1E1E1E]/60 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFC629] hover:bg-[#e6b325] text-[#1E1E1E] font-bold px-6 py-3 rounded-xl transition-colors shadow-md text-sm"
          >
            WhatsApp Us
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-[#1E1E1E] font-semibold border border-amber-200 px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Contact Us →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
