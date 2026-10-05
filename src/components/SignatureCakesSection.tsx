import React from 'react';
import { SignatureCake, CustomCakeConfiguration } from '../types/bakery';
import { SIGNATURE_CAKES, INITIAL_CUSTOM_CONFIG } from '../data/bakeryData';
import { Sliders, ShoppingBag, Sparkles } from 'lucide-react';

interface SignatureCakesSectionProps {
  onCustomizeCake: (config: CustomCakeConfiguration) => void;
  onDirectOrderCake: (cake: SignatureCake) => void;
}

export const SignatureCakesSection: React.FC<SignatureCakesSectionProps> = ({
  onCustomizeCake,
  onDirectOrderCake,
}) => {
  const handleLoadInCustomizer = (cake: SignatureCake) => {
    const merged: CustomCakeConfiguration = {
      ...INITIAL_CUSTOM_CONFIG,
      ...cake.defaultConfig,
      estimatedPrice: cake.priceFrom,
    } as CustomCakeConfiguration;
    onCustomizeCake(merged);
  };

  return (
    <section id="signature-cakes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase font-semibold tracking-widest text-amber-800">
            Curated House Signatures
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1">
            Signature Cake Collection
          </h2>
          <p className="text-stone-600 text-sm mt-2 max-w-xl">
            Chef-curated flavor pairings refined in our test kitchen. Ready to order as presented, or use as a starting foundation in our customizer.
          </p>
        </div>

        <div className="mt-4 md:mt-0 text-xs text-stone-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Organic stoneground flours · Pure French butter</span>
        </div>
      </div>

      {/* Product Cards Grid: 2x2 or 4-col responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SIGNATURE_CAKES.map((cake) => (
          <div
            key={cake.id}
            className="group bg-white rounded-xl border border-stone-200/70 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            <div>
              {/* Product Image on Neutral Solid Backdrop */}
              <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                <img
                  src={cake.image}
                  alt={cake.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-sm tabular-nums">
                  From ${cake.priceFrom}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-wider text-amber-900/80 font-medium mb-1">
                  Signature Recipe
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 leading-snug mb-1">
                  {cake.name}
                </h3>
                <p className="text-xs text-stone-500 italic mb-3">
                  {cake.tagline}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {cake.description}
                </p>

                {/* Unboxed Metadata */}
                <div className="pt-3 border-t border-stone-100 space-y-1.5 text-[11px] text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-stone-700">Best for:</span>
                    <span className="truncate">{cake.bestFor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-stone-700">Allergens:</span>
                    <span>{cake.allergens.join(' · ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLoadInCustomizer(cake)}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors whitespace-nowrap"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
              <button
                type="button"
                onClick={() => onDirectOrderCake(cake)}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
