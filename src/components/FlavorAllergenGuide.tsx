import React, { useState } from 'react';
import { SPONGE_FLAVORS, FILLING_FLAVORS, FROSTING_STYLES, TIER_OPTIONS } from '../data/bakeryData';
import { ShieldCheck, Heart, Sparkles, AlertCircle, Thermometer, Scissors } from 'lucide-react';

export const FlavorAllergenGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flavors' | 'allergens' | 'care'>('flavors');

  return (
    <section id="flavor-guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase font-semibold tracking-widest text-amber-800">
            Artisanal Standards
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1">
            Flavor Library & Ingredient Transparency
          </h2>
          <p className="text-stone-600 text-sm mt-2 max-w-xl">
            Everything baked in our open kitchen starts from scratch without artificial flavors, hydrogenated shortenings, or synthetic food dyes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 md:mt-0 flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('flavors')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'flavors'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Flavor Profiles
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('allergens')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'allergens'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Allergen Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('care')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'care'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Care & Cutting Guide
          </button>
        </div>
      </div>

      {/* Tab 1: Flavor Profiles */}
      {activeTab === 'flavors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-xs uppercase font-bold text-amber-900 tracking-wider">
                Sponge Recipes
              </span>
              <h3 className="font-serif text-lg font-semibold text-stone-900 mt-1">
                Handcrafted Bases
              </h3>
            </div>
            <div className="space-y-3">
              {SPONGE_FLAVORS.slice(0, 4).map((s) => (
                <div key={s.id} className="text-xs">
                  <div className="font-semibold text-stone-900">{s.name}</div>
                  <p className="text-stone-500 mt-0.5">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-xs uppercase font-bold text-amber-900 tracking-wider">
                Compotes & Ganache
              </span>
              <h3 className="font-serif text-lg font-semibold text-stone-900 mt-1">
                Interior Fillings
              </h3>
            </div>
            <div className="space-y-3">
              {FILLING_FLAVORS.slice(0, 4).map((f) => (
                <div key={f.id} className="text-xs">
                  <div className="font-semibold text-stone-900">{f.name}</div>
                  <p className="text-stone-500 mt-0.5">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-xs uppercase font-bold text-amber-900 tracking-wider">
                Swiss Buttercream
              </span>
              <h3 className="font-serif text-lg font-semibold text-stone-900 mt-1">
                Exterior Finishes
              </h3>
            </div>
            <div className="space-y-3">
              {FROSTING_STYLES.map((fs) => (
                <div key={fs.id} className="text-xs">
                  <div className="font-semibold text-stone-900">{fs.name}</div>
                  <p className="text-stone-500 mt-0.5">{fs.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Allergen Matrix */}
      {activeTab === 'allergens' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Nut-Conscious Baking</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Many of our cakes (Vanilla, Valrhona Chocolate, Earl Grey, Lemon) are naturally nut-free. Our almond sponge and hazelnut fillings are handled with dedicated utensils and separate wash basins.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <Heart className="w-4 h-4 text-amber-700" />
                <span>Gluten-Friendly Options</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                We prepare gluten-friendly celebration cakes using organic Spanish almond flour and tapioca starches. Note that our kitchen uses stoneground wheat flour on adjacent tables.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Pure Pasture Dairy & Eggs</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our Swiss meringue buttercream relies on pasteurized egg whites and European high-fat cultured butter. Eggless sponge options can be prepared upon special custom request.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Care & Cutting Guide */}
      {activeTab === 'care' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center gap-2 font-serif text-lg font-semibold text-stone-900">
              <Thermometer className="w-4 h-4 text-amber-800" />
              <span>Serving Temperature Guidelines</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Real butter solidifies when chilled. To experience the melt-in-your-mouth texture of our Swiss meringue buttercream:
            </p>
            <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside">
              <li>Keep refrigerated until <strong>1.5 to 2 hours before serving</strong>.</li>
              <li>Allow the cake to come to room temperature (68°F – 72°F) in a cool space away from direct sunlight.</li>
              <li>Leftovers can be sliced, wrapped airtight in cling film, and refrigerated for up to 5 days or frozen for 30 days.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center gap-2 font-serif text-lg font-semibold text-stone-900">
              <Scissors className="w-4 h-4 text-amber-800" />
              <span>Cutting & Portion Yields</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              For clean, picture-perfect cake slices with multi-layer crumb definition:
            </p>
            <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside">
              <li>Use a long chef knife dipped in hot water and wiped dry between every cut.</li>
              <li>For tall 4-layer and tiered cakes, cut concentric rings or grid planks (2" x 1") rather than deep wedges for twice the serving yield.</li>
              <li>Remove internal food-safe support dowels before cutting lower tiers.</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
