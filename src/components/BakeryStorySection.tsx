import React from 'react';
import { KITCHEN_IMAGE } from '../data/bakeryData';
import { Award, Clock, MapPin, Star, ShieldCheck } from 'lucide-react';

export const BakeryStorySection: React.FC = () => {
  return (
    <section id="our-kitchen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Split Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Image with Subtle Frame */}
        <div className="lg:col-span-6 relative">
          <div className="aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
            <img
              src={KITCHEN_IMAGE}
              alt="Artisan pastry chef hand-piping buttercream in the bakery workshop"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Subtle Trust Label */}
          <div className="absolute -bottom-4 -right-4 bg-white border border-stone-200/80 rounded-xl p-4 shadow-md max-w-xs hidden sm:block">
            <div className="flex items-center gap-1 text-amber-700 text-xs mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-700" />
              ))}
            </div>
            <p className="text-xs text-stone-700 font-medium">
              "Wildflour designed our wedding centerpiece. The Earl Grey sponge and wildflower detailing was breathtaking."
            </p>
            <span className="text-[10px] text-stone-400 block mt-1">
              — Madeline & James C., June 2026
            </span>
          </div>
        </div>

        {/* Right Column: Narrative */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-amber-800">
              Our Scratch Kitchen
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1">
              Baked Fresh to Order, Never Frozen
            </h2>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed">
            Founded in 2018 in Riverdale, Wildflour began as an intimate custom cake studio dedicated to reviving old-world patisserie techniques. We whip pure French butter with slow-cooked meringue, simmer local berries for our tart coulis, and hand-pipe every single rococo ruffle and petal.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
              <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                2,400+
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Bespoke celebrations & wedding cakes crafted
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                100%
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Organic stoneground flour & French butter
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200/70 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-500" />
              <span>412 Artisan Way, Riverdale · Tuesday – Sunday 8:00 AM – 6:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-500" />
              <span>Custom cake consultations by appointment · 48-hr minimum lead time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
