import React, { useState } from 'react';
import { ChefHat, ShoppingBag, Menu, X } from 'lucide-react';

interface HeaderNavProps {
  onOpenCustomizer: () => void;
  onOpenTracker: () => void;
  isKitchenMode: boolean;
  onToggleKitchenMode: () => void;
  ordersCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenCustomizer,
  onOpenTracker,
  isKitchenMode,
  onToggleKitchenMode,
  ordersCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="font-serif text-xl font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors whitespace-nowrap"
          >
            Wildflour Bakery
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-600">
            <a
              href="#custom-builder"
              onClick={onOpenCustomizer}
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              Custom Studio
            </a>
            <a
              href="#signature-cakes"
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              Signatures
            </a>
            <a
              href="#flavor-guide"
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              Flavor Library
            </a>
            <a
              href="#order-tracker"
              onClick={onOpenTracker}
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              Order Tracker
            </a>
            <a
              href="#our-kitchen"
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              Our Kitchen
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleKitchenMode}
              title="Staff Kitchen View"
              className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isKitchenMode
                  ? 'bg-amber-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isKitchenMode ? 'Staff Mode' : 'Kitchen'}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenCustomizer}
              className="bg-stone-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors whitespace-nowrap"
            >
              Order Custom Cake
            </button>

            {/* Mobile menu hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-stone-200 px-4 pt-3 pb-5 space-y-3">
          <a
            href="#custom-builder"
            onClick={() => {
              onOpenCustomizer();
              setMobileMenuOpen(false);
            }}
            className="block py-2 text-xs font-semibold text-stone-800"
          >
            Custom Studio
          </a>
          <a
            href="#signature-cakes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-stone-800"
          >
            Signatures
          </a>
          <a
            href="#flavor-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-stone-800"
          >
            Flavor Library
          </a>
          <a
            href="#order-tracker"
            onClick={() => {
              onOpenTracker();
              setMobileMenuOpen(false);
            }}
            className="block py-2 text-xs font-semibold text-stone-800"
          >
            Order Tracker
          </a>
          <a
            href="#our-kitchen"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-stone-800"
          >
            Our Kitchen
          </a>
        </div>
      )}
    </header>
  );
};
