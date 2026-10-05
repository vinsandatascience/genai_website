import React, { useState } from 'react';
import {
  CustomCakeConfiguration,
  CakeTierSize,
  CakeShape,
  InscriptionOption,
} from '../types/bakery';
import {
  TIER_OPTIONS,
  SPONGE_FLAVORS,
  FILLING_FLAVORS,
  FROSTING_STYLES,
  COLOR_PALETTES,
  DRIP_OPTIONS,
  TOPPING_OPTIONS,
} from '../data/bakeryData';
import { calculateCakePrice } from '../utils/pricing';
import { CakeVisualizer } from './CakeVisualizer';
import {
  Check,
  Sparkles,
  Layers,
  Palette,
  Type,
  AlertTriangle,
  Upload,
  ArrowRight,
  ShieldCheck,
  Calendar,
  RotateCcw,
} from 'lucide-react';

interface CustomCakeBuilderProps {
  initialConfig?: CustomCakeConfiguration;
  onProceedToOrder: (config: CustomCakeConfiguration) => void;
}

export const CustomCakeBuilder: React.FC<CustomCakeBuilderProps> = ({
  initialConfig,
  onProceedToOrder,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [config, setConfig] = useState<CustomCakeConfiguration>(() => {
    if (initialConfig) {
      const breakdown = calculateCakePrice(initialConfig);
      return { ...initialConfig, estimatedPrice: breakdown.subtotal };
    }
    const defaultConf: CustomCakeConfiguration = {
      occasion: 'Birthday Celebration',
      tierSize: 'single_8',
      shape: 'round',
      spongeFlavorId: 'sponge_vanilla',
      fillingFlavorId: 'fill_berry_coulis',
      frostingStyleId: 'style_smooth',
      frostingColorId: 'color_ivory',
      dripId: 'drip_none',
      selectedToppingIds: ['top_berries', 'top_gold_leaf'],
      inscription: {
        text: 'Happy Birthday',
        style: 'piped_cursive',
        color: '#3B3632',
        price: 5,
      },
      dietaryRequirements: [],
      inspirationNotes: '',
      inspirationImageUrl: undefined,
      estimatedPrice: 147,
    };
    const breakdown = calculateCakePrice(defaultConf);
    return { ...defaultConf, estimatedPrice: breakdown.subtotal };
  });

  const updateConfig = (updates: Partial<CustomCakeConfiguration>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      const breakdown = calculateCakePrice(next);
      return { ...next, estimatedPrice: breakdown.subtotal };
    });
  };

  const toggleTopping = (toppingId: string) => {
    const current = [...config.selectedToppingIds];
    const index = current.indexOf(toppingId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(toppingId);
    }
    updateConfig({ selectedToppingIds: current });
  };

  const toggleDietary = (item: string) => {
    const current = [...config.dietaryRequirements];
    const index = current.indexOf(item);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(item);
    }
    updateConfig({ dietaryRequirements: current });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig({ inspirationImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const breakdown = calculateCakePrice(config);

  const steps = [
    { number: 1, label: 'Size & Shape' },
    { number: 2, label: 'Sponge & Filling' },
    { number: 3, label: 'Frosting & Color' },
    { number: 4, label: 'Toppings & Script' },
    { number: 5, label: 'Dietary & Details' },
  ];

  return (
    <div id="custom-builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs uppercase font-semibold tracking-widest text-amber-800">
          The Bespoke Atelier
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1 mb-3">
          Design Your Custom Cake
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Craft your dream celebration cake with scratch-baked artisanal layers, European
          buttercreams, and handcrafted botanical decorations. Watch your design come alive in real time.
        </p>
      </div>

      {/* Main Grid: Left is Sticky Visualizer & Price Card; Right is Step Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Visualizer Column (5 cols on lg) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <CakeVisualizer config={config} />

          {/* Quick Specifications & Price Summary Box */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-serif text-base font-semibold text-stone-900">
                Custom Specifications
              </span>
              <span className="font-serif text-xl font-bold text-stone-900 tabular-nums">
                ${config.estimatedPrice}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{breakdown.tierBase.name} ({config.shape})</span>
                <span className="tabular-nums font-medium text-stone-800">
                  ${breakdown.tierBase.price + breakdown.shapeSurcharge.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sponge: {breakdown.sponge.name}</span>
                <span className="tabular-nums font-medium text-stone-800">
                  {breakdown.sponge.price > 0 ? `+$${breakdown.sponge.price}` : 'Incl.'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Filling: {breakdown.filling.name}</span>
                <span className="tabular-nums font-medium text-stone-800">
                  {breakdown.filling.price > 0 ? `+$${breakdown.filling.price}` : 'Incl.'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Finish: {breakdown.frostingStyle.name}</span>
                <span className="tabular-nums font-medium text-stone-800">
                  {breakdown.frostingStyle.price > 0 ? `+$${breakdown.frostingStyle.price}` : 'Incl.'}
                </span>
              </div>
              {breakdown.drip.price > 0 && (
                <div className="flex justify-between">
                  <span>Drip: {breakdown.drip.name}</span>
                  <span className="tabular-nums font-medium text-stone-800">+${breakdown.drip.price}</span>
                </div>
              )}
              {breakdown.toppings.length > 0 && (
                <div className="flex justify-between">
                  <span>Toppings: {breakdown.toppings.map((t) => t.name).join(', ')}</span>
                  <span className="tabular-nums font-medium text-stone-800">
                    +${breakdown.toppings.reduce((sum, t) => sum + t.price, 0)}
                  </span>
                </div>
              )}
              {breakdown.inscription.price > 0 && (
                <div className="flex justify-between">
                  <span>{breakdown.inscription.name}</span>
                  <span className="tabular-nums font-medium text-stone-800">+${breakdown.inscription.price}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="text-xs text-stone-500">
                Requires 48–72 hr minimum notice
              </div>
              <button
                type="button"
                onClick={() => onProceedToOrder(config)}
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Builder Step Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
          {/* Step Progress Navigation */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100 overflow-x-auto">
            {steps.map((s) => (
              <button
                key={s.number}
                type="button"
                onClick={() => setActiveStep(s.number)}
                className={`flex items-center gap-2 text-xs font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeStep === s.number
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    activeStep === s.number
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {s.number}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* STEP 1: SIZE & SHAPE */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Select Cake Size & Tier Architecture
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {TIER_OPTIONS.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => updateConfig({ tierSize: tier.id })}
                      className={`cursor-pointer rounded-xl p-4 border transition-all flex items-center justify-between ${
                        config.tierSize === tier.id
                          ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-semibold text-stone-900 text-sm sm:text-base">
                            {tier.name}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="text-xs text-amber-900 font-medium">
                            {tier.servings}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">{tier.dimensions}</p>
                        <p className="text-xs text-stone-600 italic">{tier.description}</p>
                      </div>
                      <div className="text-right pl-4">
                        <span className="font-serif font-bold text-base text-stone-900 tabular-nums">
                          ${tier.basePrice}
                        </span>
                        <div
                          className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ml-auto ${
                            config.tierSize === tier.id
                              ? 'bg-stone-900 border-stone-900 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {config.tierSize === tier.id && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cake Shape */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Select Cake Geometry / Shape
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'round' as CakeShape, label: 'Classic Round', desc: 'Standard artisanal cylinder', fee: 0 },
                    { id: 'heart' as CakeShape, label: 'Romantic Heart', desc: 'Sculpted romantic tin', fee: 12 },
                    { id: 'square' as CakeShape, label: 'Modern Square', desc: 'Crisp architectural lines', fee: 8 },
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => updateConfig({ shape: shape.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        config.shape === shape.id
                          ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-xs text-stone-900">{shape.label}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{shape.desc}</div>
                      <div className="text-[11px] text-stone-700 font-medium mt-1">
                        {shape.fee > 0 ? `+$${shape.fee}` : 'Standard'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="bg-stone-900 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
                >
                  <span>Next: Sponge & Filling</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SPONGE & FILLING */}
          {activeStep === 2 && (
            <div className="space-y-6">
              {/* Sponge Flavors */}
              <div>
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Choose Sponge Cake Flavor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SPONGE_FLAVORS.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => updateConfig({ spongeFlavorId: s.id })}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                        config.spongeFlavorId === s.id
                          ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif font-semibold text-stone-900 text-sm">
                            {s.name}
                          </span>
                          <span className="text-xs font-semibold text-stone-700 tabular-nums">
                            {s.price > 0 ? `+$${s.price}` : 'Included'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed mb-2">
                          {s.description}
                        </p>
                      </div>
                      {s.dietaryNotes && s.dietaryNotes.length > 0 && (
                        <div className="text-[10px] text-stone-500 flex items-center gap-1.5 pt-1 border-t border-stone-100">
                          {s.dietaryNotes.join(' · ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Filling Flavors */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Choose Interior Filling & Coulis Layer
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FILLING_FLAVORS.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => updateConfig({ fillingFlavorId: f.id })}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                        config.fillingFlavorId === f.id
                          ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif font-semibold text-stone-900 text-sm">
                            {f.name}
                          </span>
                          <span className="text-xs font-semibold text-stone-700 tabular-nums">
                            {f.price > 0 ? `+$${f.price}` : 'Included'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed mb-1">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="bg-stone-900 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
                >
                  <span>Next: Frosting & Palette</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FROSTING & COLOR */}
          {activeStep === 3 && (
            <div className="space-y-6">
              {/* Frosting Style */}
              <div>
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Exterior Frosting Finish & Technique
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FROSTING_STYLES.map((fs) => (
                    <div
                      key={fs.id}
                      onClick={() => updateConfig({ frostingStyleId: fs.id })}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                        config.frostingStyleId === fs.id
                          ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-semibold text-stone-900 text-sm">
                          {fs.name}
                        </span>
                        <span className="text-xs font-semibold text-stone-700 tabular-nums">
                          {fs.price > 0 ? `+$${fs.price}` : 'Standard'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {fs.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Select Buttercream Color Tone
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {COLOR_PALETTES.map((cp) => (
                    <button
                      key={cp.id}
                      type="button"
                      onClick={() => updateConfig({ frostingColorId: cp.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        config.frostingColorId === cp.id
                          ? 'border-stone-900 bg-stone-50/80 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-stone-300 shrink-0 shadow-xs"
                        style={{ backgroundColor: cp.hex }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-medium text-stone-900 truncate">
                          {cp.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drip Glaze */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Artisanal Drip Glaze (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DRIP_OPTIONS.map((drip) => (
                    <button
                      key={drip.id}
                      type="button"
                      onClick={() => updateConfig({ dripId: drip.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        config.dripId === drip.id
                          ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {drip.color !== 'transparent' && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                            style={{ backgroundColor: drip.color }}
                          />
                        )}
                        <span className="text-xs font-medium text-stone-900">{drip.name}</span>
                      </div>
                      <span className="text-xs text-stone-600 font-medium tabular-nums">
                        {drip.price > 0 ? `+$${drip.price}` : 'None'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="bg-stone-900 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
                >
                  <span>Next: Toppings & Script</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: TOPPINGS & SCRIPT */}
          {activeStep === 4 && (
            <div className="space-y-6">
              {/* Topping Accents */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                    Handcrafted Toppings & Botanical Accents
                  </label>
                  <span className="text-xs text-stone-400">Select any combinations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TOPPING_OPTIONS.map((top) => {
                    const isSelected = config.selectedToppingIds.includes(top.id);
                    return (
                      <div
                        key={top.id}
                        onClick={() => toggleTopping(top.id)}
                        className={`cursor-pointer rounded-xl p-3.5 border transition-all flex items-start justify-between ${
                          isSelected
                            ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-stone-900 text-xs">
                              {top.name}
                            </span>
                            <span className="text-xs text-stone-600 font-semibold tabular-nums">
                              +${top.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 leading-normal">
                            {top.description}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-stone-900 border-stone-900 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Inscription */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Custom Cake Inscription or Message
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      maxLength={32}
                      value={config.inscription.text}
                      onChange={(e) =>
                        updateConfig({
                          inscription: {
                            ...config.inscription,
                            text: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Happy 30th Clara or Forever & Always"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-900 focus:outline-hidden focus:border-stone-800 transition-colors"
                    />
                    <div className="flex justify-between items-center mt-1 text-[11px] text-stone-400">
                      <span>Max 32 characters for clean aesthetic legibility</span>
                      <span>{config.inscription.text.length}/32</span>
                    </div>
                  </div>

                  {/* Inscription Style */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      {
                        style: 'piped_cursive' as const,
                        label: 'Hand-Piped Cursive',
                        fee: 5,
                        desc: 'Classic Swiss meringue script',
                      },
                      {
                        style: 'sugar_plaque' as const,
                        label: 'Sugar Plaque',
                        fee: 8,
                        desc: 'Hand-stamped fondant plaque',
                      },
                      {
                        style: 'acrylic_topper' as const,
                        label: 'Artisan Stick Topper',
                        fee: 15,
                        desc: 'Laser cut wooden/acrylic topper',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.style}
                        type="button"
                        onClick={() =>
                          updateConfig({
                            inscription: {
                              ...config.inscription,
                              style: opt.style,
                              price: opt.fee,
                            },
                          })
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          config.inscription.style === opt.style
                            ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="text-xs font-semibold text-stone-900">{opt.label}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{opt.desc}</div>
                        <div className="text-[10px] text-stone-700 font-semibold mt-1">
                          +${opt.fee}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(5)}
                  className="bg-stone-900 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
                >
                  <span>Next: Dietary & Inspiration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: DIETARY, INSPIRATION & FINALIZE */}
          {activeStep === 5 && (
            <div className="space-y-6">
              {/* Dietary and Allergies */}
              <div>
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Allergen Alerts & Dietary Adjustments
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Nut-Free Kitchen Handling (Severe Nut Allergy)',
                    'Gluten-Friendly Sponge Request',
                    'Eggless Sponge Preparation',
                    'Reduced Sugar / Low Sweetness Formulation',
                  ].map((diet) => {
                    const active = config.dietaryRequirements.includes(diet);
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => toggleDietary(diet)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          active
                            ? 'border-amber-900 bg-amber-50/50 text-stone-900'
                            : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                        }`}
                      >
                        <span className="text-xs font-medium">{diet}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            active
                              ? 'bg-amber-900 border-amber-900 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {active && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-500 mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                  <span>
                    Our bakery handles tree nuts, dairy, wheat, and eggs. We sanitize dedicated
                    stations for allergen-conscious orders.
                  </span>
                </p>
              </div>

              {/* Inspiration Notes & Upload */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Styling Notes & Inspiration Photo (Optional)
                </label>
                <textarea
                  rows={3}
                  value={config.inspirationNotes}
                  onChange={(e) => updateConfig({ inspirationNotes: e.target.value })}
                  placeholder="Tell our pastry chef about your event theme, color palette preferences, or mood..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800 transition-colors"
                />

                <div className="mt-3 flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 border border-stone-200 px-3.5 py-2 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Mood Board / Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {config.inspirationImageUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={config.inspirationImageUrl}
                        alt="Inspiration reference"
                        className="w-8 h-8 rounded-md object-cover border border-stone-200"
                      />
                      <span className="text-xs text-stone-500">Image attached</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Action Button */}
              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => onProceedToOrder(config)}
                  className="bg-stone-900 text-white px-6 py-3 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Proceed to Date & Checkout (${config.estimatedPrice})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
