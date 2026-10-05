import React from 'react';

export const BakeryFooter: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Wildflour Bakery
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              Boutique artisanal patisserie specializing in custom architectural celebration cakes, botanical styling, and European scratch baking.
            </p>
            <div className="text-xs text-stone-500">
              Licensed scratch kitchen facility #RD-4921
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-stone-200 tracking-wider mb-3">
              Explore Atelier
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#custom-builder" className="hover:text-white transition-colors">
                  Interactive Cake Studio
                </a>
              </li>
              <li>
                <a href="#signature-cakes" className="hover:text-white transition-colors">
                  Signature Cakes
                </a>
              </li>
              <li>
                <a href="#flavor-guide" className="hover:text-white transition-colors">
                  Flavor & Ingredient Guide
                </a>
              </li>
              <li>
                <a href="#order-tracker" className="hover:text-white transition-colors">
                  Live Order Tracker
                </a>
              </li>
            </ul>
          </div>

          {/* Kitchen Hours */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-stone-200 tracking-wider mb-3">
              Bakery Hours
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Tuesday – Friday</span>
                <span className="text-stone-300 font-medium">8:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday – Sunday</span>
                <span className="text-stone-300 font-medium">8:00 AM – 4:00 PM</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Monday</span>
                <span>Closed for Prep</span>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-stone-200 tracking-wider mb-3">
              Visit & Inquire
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p>412 Artisan Way, Suite B<br />Riverdale, CA 90210</p>
              <p>Phone: (555) 349-2910</p>
              <p>Email: atelier@wildflourbakery.com</p>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Wildflour Bakery & Custom Confections LLC. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Made with pure French butter & organic flour</span>
            <span>·</span>
            <span>48-hr order lead time</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
