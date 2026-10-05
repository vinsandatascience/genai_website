import React from 'react';
import { HERO_IMAGE } from '../data/bakeryData';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onStartCustomizer: () => void;
  onExploreSignatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCustomizer,
  onExploreSignatures,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-stone-200/80 bg-gradient-to-b from-[#FBF9F6] to-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-900 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-800" />
              <span>Est. 2018 · Riverdale Scratch Patisserie</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.12] text-balance">
              Artisanal Custom Cakes for Life’s Grandest Milestones
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Design your dream bespoke celebration cake online. Hand-whipped European buttercreams, stone-ground flours, and organic botanicals—baked fresh for your date.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartCustomizer}
                className="bg-stone-900 text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Launch 3D Customizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreSignatures}
                className="bg-white border border-stone-300 text-stone-800 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors inline-flex items-center justify-center"
              >
                <span>Browse Signature Cakes</span>
              </button>
            </div>

            {/* Unboxed Metadata Proof Points */}
            <div className="pt-6 border-t border-stone-200/70 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-500">
              <div className="flex items-center gap-1.5 text-stone-700">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>48-Hour Notice Minimum</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>8 to 80 Guests</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>In-Store Pickup & Courier Delivery</span>
            </div>
          </div>

          {/* Right Image Showcase Column (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-16/11 rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-100">
              <img
                src={HERO_IMAGE}
                alt="Two-tier custom wedding cake with figs and organic botanicals on ceramic stand"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Subtle Overlay Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between text-xs">
                <span className="font-serif italic text-sm">
                  The Maison Tiered Centerpiece
                </span>
                <span className="font-medium bg-stone-900/60 backdrop-blur-xs px-2.5 py-1 rounded-sm tabular-nums">
                  Custom Hand-Piped
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
