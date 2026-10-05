import React, { useState } from 'react';
import {
  CustomCakeConfiguration,
  TierOption,
  ColorPaletteOption,
  DripOption,
  FlavorOption,
} from '../types/bakery';
import {
  TIER_OPTIONS,
  COLOR_PALETTES,
  DRIP_OPTIONS,
  SPONGE_FLAVORS,
  FILLING_FLAVORS,
  FROSTING_STYLES,
} from '../data/bakeryData';
import { Layers, Eye, Sparkles, Check, Info } from 'lucide-react';

interface CakeVisualizerProps {
  config: CustomCakeConfiguration;
  onUpdateConfig?: (updates: Partial<CustomCakeConfiguration>) => void;
}

export const CakeVisualizer: React.FC<CakeVisualizerProps> = ({ config }) => {
  const [viewMode, setViewMode] = useState<'3d' | 'cutaway'>('3d');
  const [isRotating, setIsRotating] = useState(false);

  const tier = TIER_OPTIONS.find((t) => t.id === config.tierSize) || TIER_OPTIONS[1];
  const color = COLOR_PALETTES.find((c) => c.id === config.frostingColorId) || COLOR_PALETTES[0];
  const drip = DRIP_OPTIONS.find((d) => d.id === config.dripId) || DRIP_OPTIONS[0];
  const sponge = SPONGE_FLAVORS.find((s) => s.id === config.spongeFlavorId) || SPONGE_FLAVORS[0];
  const filling = FILLING_FLAVORS.find((f) => f.id === config.fillingFlavorId) || FILLING_FLAVORS[0];
  const frostingStyle = FROSTING_STYLES.find((s) => s.id === config.frostingStyleId) || FROSTING_STYLES[0];

  const hasTopping = (id: string) => config.selectedToppingIds.includes(id);

  // Sponge & filling colors for the cutaway cross-section view
  const getSpongeHex = (id: string) => {
    switch (id) {
      case 'sponge_chocolate':
        return '#3D251E';
      case 'sponge_earl_grey':
        return '#A89988';
      case 'sponge_lemon_poppy':
        return '#E5CD89';
      case 'sponge_brown_butter':
        return '#B88B4A';
      case 'sponge_matcha':
        return '#7C9365';
      case 'sponge_gf_almond':
        return '#DFC596';
      default:
        return '#EED7A1'; // vanilla bean golden sponge
    }
  };

  const getFillingHex = (id: string) => {
    switch (id) {
      case 'fill_berry_coulis':
        return '#8A1C3C';
      case 'fill_salted_caramel':
        return '#C27429';
      case 'fill_passionfruit':
        return '#E89E23';
      case 'fill_espresso_mascarpone':
        return '#4E3629';
      case 'fill_hazelnut_praline':
        return '#875836';
      default:
        return '#FFF5DE'; // diplomat cream
    }
  };

  const spongeColor = getSpongeHex(config.spongeFlavorId);
  const fillingColor = getFillingHex(config.fillingFlavorId);

  return (
    <div className="relative bg-gradient-to-b from-[#F7F4EE] to-[#EFECE5] rounded-2xl border border-stone-200/80 p-6 flex flex-col items-center justify-between min-h-[460px] overflow-hidden shadow-xs">
      {/* Visualizer Top Bar Controls */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Live Preview
          </span>
          <span className="text-stone-300">/</span>
          <span className="text-xs text-stone-500 font-medium">
            {tier.name} · {tier.servings}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === '3d'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Exterior</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cutaway')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'cutaway'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cross Section</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        className={`w-full max-w-[420px] aspect-square flex items-center justify-center transition-transform duration-500 my-2 ${
          isRotating ? 'scale-95 rotate-1' : 'scale-100'
        }`}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-md select-none overflow-visible"
        >
          <defs>
            {/* Cake stand gradient */}
            <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D9D5CC" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#C8C4BA" />
            </linearGradient>

            {/* Cake surface lighting gradient */}
            <linearGradient id="frostingBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color.borderHex} />
              <stop offset="35%" stopColor={color.hex} />
              <stop offset="70%" stopColor={color.hex} />
              <stop offset="100%" stopColor={color.borderHex} />
            </linearGradient>

            <linearGradient id="dripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={drip.color} />
              <stop offset="100%" stopColor={drip.color} stopOpacity="0.92" />
            </linearGradient>

            {/* Gold leaf shimmer pattern */}
            <pattern id="goldLeafSpecks" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 5 8 Q 8 6 11 9 T 14 12 Z M 28 20 Q 32 18 35 23 T 31 27 Z M 16 32 Q 19 30 22 34 Z"
                fill="#F2BC3F"
                opacity="0.9"
              />
              <circle cx="22" cy="10" r="1.5" fill="#FFE58F" />
              <circle cx="7" cy="26" r="1.2" fill="#FFE58F" />
            </pattern>

            {/* Stucco palette knife pattern */}
            <pattern id="stuccoTexture" width="60" height="30" patternUnits="userSpaceOnUse">
              <path
                d="M 2 12 C 15 8, 35 16, 55 11 M 10 24 C 28 20, 42 27, 58 22"
                stroke={color.borderHex}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
            </pattern>

            {/* Semi-naked crumb reveal lines */}
            <pattern id="semiNakedPattern" width="40" height="20" patternUnits="userSpaceOnUse">
              <line
                x1="0"
                y1="8"
                x2="40"
                y2="8"
                stroke={spongeColor}
                strokeWidth="3.5"
                strokeDasharray="14 10 8 8"
                opacity="0.55"
              />
              <line
                x1="0"
                y1="16"
                x2="40"
                y2="16"
                stroke={spongeColor}
                strokeWidth="2.5"
                strokeDasharray="6 8 18 8"
                opacity="0.45"
              />
            </pattern>
          </defs>

          {/* Pedestal Stand / Marble Slab */}
          <g id="pedestal">
            {/* Stand Base */}
            <path
              d="M 140 375 L 260 375 L 250 365 L 150 365 Z"
              fill="url(#pedestalGrad)"
              stroke="#B5B0A4"
              strokeWidth="0.8"
            />
            {/* Stand Stem */}
            <path
              d="M 188 365 L 212 365 L 208 340 L 192 340 Z"
              fill="url(#pedestalGrad)"
              stroke="#B5B0A4"
              strokeWidth="0.8"
            />
            {/* Pedestal Plate */}
            <ellipse
              cx="200"
              cy="340"
              rx="155"
              ry="24"
              fill="#EFECE5"
              stroke="#B5B0A4"
              strokeWidth="1.2"
            />
            <ellipse
              cx="200"
              cy="338"
              rx="150"
              ry="22"
              fill="url(#pedestalGrad)"
              opacity="0.9"
            />
          </g>

          {/* VIEW MODE: 3D EXTERIOR */}
          {viewMode === '3d' && (
            <g id="cake-exterior">
              {/* TIER 1 (BASE TIER - Present in all configs) */}
              <g id="base-tier">
                {/* Cylinder Side */}
                {config.shape === 'heart' ? (
                  // Heart Shape stylized representation
                  <path
                    d="M 90 270 C 90 220, 160 220, 200 245 C 240 220, 310 220, 310 270 C 310 315, 230 338, 200 350 C 170 338, 90 315, 90 270 Z"
                    fill="url(#frostingBodyGrad)"
                    stroke={color.borderHex}
                    strokeWidth="1.5"
                  />
                ) : (
                  // Round / Square
                  <g>
                    <path
                      d="M 75 250 L 75 320 C 75 338, 325 338, 325 320 L 325 250 Z"
                      fill="url(#frostingBodyGrad)"
                      stroke={color.borderHex}
                      strokeWidth="1.5"
                    />
                    {/* Texture overlay if stucco */}
                    {frostingStyle.id === 'style_textured' && (
                      <path
                        d="M 75 250 L 75 320 C 75 338, 325 338, 325 320 L 325 250 Z"
                        fill="url(#stuccoTexture)"
                      />
                    )}
                    {/* Semi-naked crumb peek-through */}
                    {frostingStyle.id === 'style_semi_naked' && (
                      <path
                        d="M 75 250 L 75 320 C 75 338, 325 338, 325 320 L 325 250 Z"
                        fill="url(#semiNakedPattern)"
                      />
                    )}
                    {/* Cylinder Top Cap */}
                    <ellipse
                      cx="200"
                      cy="250"
                      rx="125"
                      ry="22"
                      fill={color.hex}
                      stroke={color.borderHex}
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Vintage Lambeth Ruffles for Base Tier */}
                {frostingStyle.id === 'style_vintage_lambeth' && (
                  <g id="lambeth-base-ruffles">
                    {/* Base scallop rim */}
                    <path
                      d="M 80 320 Q 100 328, 120 323 Q 140 330, 160 324 Q 180 332, 200 325 Q 220 332, 240 324 Q 260 330, 280 323 Q 300 328, 320 320"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      fill="none"
                      opacity="0.85"
                    />
                    {/* Garland swags */}
                    <path
                      d="M 85 270 Q 120 295, 155 272 Q 190 298, 225 272 Q 260 298, 295 272"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      fill="none"
                      opacity="0.9"
                    />
                    <path
                      d="M 95 276 Q 120 298, 145 278 M 165 278 Q 190 300, 215 278 M 235 278 Q 260 300, 285 278"
                      stroke={color.borderHex}
                      strokeWidth="1.5"
                      fill="none"
                      opacity="0.75"
                    />
                  </g>
                )}
              </g>

              {/* TIER 2 (If 2-tier or 3-tier) */}
              {(tier.tiersCount >= 2) && (
                <g id="tier-2">
                  {/* Cylinder Body */}
                  <path
                    d="M 110 170 L 110 240 C 110 254, 290 254, 290 240 L 290 170 Z"
                    fill="url(#frostingBodyGrad)"
                    stroke={color.borderHex}
                    strokeWidth="1.5"
                  />
                  {frostingStyle.id === 'style_textured' && (
                    <path
                      d="M 110 170 L 110 240 C 110 254, 290 254, 290 240 L 290 170 Z"
                      fill="url(#stuccoTexture)"
                    />
                  )}
                  {frostingStyle.id === 'style_semi_naked' && (
                    <path
                      d="M 110 170 L 110 240 C 110 254, 290 254, 290 240 L 290 170 Z"
                      fill="url(#semiNakedPattern)"
                    />
                  )}
                  {/* Cylinder Top Cap */}
                  <ellipse
                    cx="200"
                    cy="170"
                    rx="90"
                    ry="17"
                    fill={color.hex}
                    stroke={color.borderHex}
                    strokeWidth="1.5"
                  />

                  {/* Lambeth ruffles tier 2 */}
                  {frostingStyle.id === 'style_vintage_lambeth' && (
                    <path
                      d="M 115 190 Q 145 210, 175 192 Q 205 212, 235 192 Q 265 210, 285 190"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      fill="none"
                      opacity="0.85"
                    />
                  )}
                </g>
              )}

              {/* TIER 3 (If 3-tier) */}
              {tier.tiersCount === 3 && (
                <g id="tier-3">
                  {/* Cylinder Body */}
                  <path
                    d="M 140 105 L 140 162 C 140 174, 260 174, 260 162 L 260 105 Z"
                    fill="url(#frostingBodyGrad)"
                    stroke={color.borderHex}
                    strokeWidth="1.5"
                  />
                  {frostingStyle.id === 'style_textured' && (
                    <path
                      d="M 140 105 L 140 162 C 140 174, 260 174, 260 162 L 260 105 Z"
                      fill="url(#stuccoTexture)"
                    />
                  )}
                  {/* Cylinder Top Cap */}
                  <ellipse
                    cx="200"
                    cy="105"
                    rx="60"
                    ry="13"
                    fill={color.hex}
                    stroke={color.borderHex}
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* DRIP GLAZE OVERLAY */}
              {drip.id !== 'drip_none' && (
                <g id="drip-glaze">
                  {tier.tiersCount === 1 ? (
                    // Drip on single tier
                    <g>
                      <ellipse
                        cx="200"
                        cy="250"
                        rx="124"
                        ry="21"
                        fill="url(#dripGrad)"
                        opacity="0.95"
                      />
                      <path
                        d="M 76 250 
                           C 85 265, 90 282, 94 282 C 98 282, 102 260, 108 252
                           C 114 268, 120 295, 125 295 C 130 295, 134 260, 140 252
                           C 148 266, 154 286, 160 286 C 166 286, 172 262, 178 253
                           C 186 270, 192 300, 198 300 C 204 300, 210 264, 218 253
                           C 226 268, 232 290, 238 290 C 244 290, 250 262, 258 252
                           C 266 268, 272 284, 278 284 C 284 284, 290 260, 298 251
                           C 306 264, 314 278, 320 274 C 324 264, 324 250, 324 250 Z"
                        fill="url(#dripGrad)"
                      />
                    </g>
                  ) : (
                    // Drip on top tier of multi-tier
                    <g>
                      {tier.tiersCount === 2 ? (
                        <g>
                          <ellipse
                            cx="200"
                            cy="170"
                            rx="89"
                            ry="16"
                            fill="url(#dripGrad)"
                            opacity="0.95"
                          />
                          <path
                            d="M 111 170 
                               C 120 185, 125 200, 130 200 C 135 200, 140 180, 148 172
                               C 155 186, 162 210, 168 210 C 174 210, 180 182, 188 172
                               C 196 186, 202 215, 208 215 C 214 215, 220 184, 228 172
                               C 236 186, 244 204, 250 204 C 256 204, 264 182, 272 172
                               C 278 184, 284 196, 289 192 L 289 170 Z"
                            fill="url(#dripGrad)"
                          />
                        </g>
                      ) : (
                        <g>
                          <ellipse
                            cx="200"
                            cy="105"
                            rx="59"
                            ry="12"
                            fill="url(#dripGrad)"
                            opacity="0.95"
                          />
                          <path
                            d="M 141 105 
                               C 150 118, 155 132, 160 132 C 165 132, 170 115, 176 107
                               C 182 120, 188 140, 194 140 C 200 140, 206 118, 214 107
                               C 222 120, 228 135, 234 135 C 240 135, 248 116, 258 107 L 258 105 Z"
                            fill="url(#dripGrad)"
                          />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              )}

              {/* TOPPING ACCENTS */}
              {/* 24k Gold Leaf Flakes */}
              {hasTopping('top_gold_leaf') && (
                <rect
                  x="80"
                  y={tier.tiersCount === 3 ? 95 : tier.tiersCount === 2 ? 160 : 235}
                  width="240"
                  height="110"
                  fill="url(#goldLeafSpecks)"
                  style={{ mixBlendMode: 'color-burn' }}
                />
              )}

              {/* Top Surface Center calculation */}
              {(() => {
                const topCy = tier.tiersCount === 3 ? 105 : tier.tiersCount === 2 ? 170 : 250;
                const topRadiusX = tier.tiersCount === 3 ? 55 : tier.tiersCount === 2 ? 85 : 120;

                return (
                  <g id="crown-toppings">
                    {/* Fresh Berries (Blackberries & Raspberries) */}
                    {hasTopping('top_berries') && (
                      <g id="berries">
                        {/* Blackberry cluster */}
                        <circle cx={200 - topRadiusX * 0.35} cy={topCy - 6} r="7" fill="#1C1422" />
                        <circle cx={200 - topRadiusX * 0.35 + 4} cy={topCy - 10} r="6" fill="#2E2038" />
                        <circle cx={200 - topRadiusX * 0.35 - 5} cy={topCy - 4} r="5" fill="#2E2038" />
                        {/* Raspberry */}
                        <circle cx={200 + topRadiusX * 0.3} cy={topCy - 8} r="8" fill="#A81B3E" />
                        <circle cx={200 + topRadiusX * 0.3 + 5} cy={topCy - 12} r="6" fill="#C92953" />
                        {/* Blueberries */}
                        <circle cx={200 - 8} cy={topCy - 10} r="5.5" fill="#243354" />
                        <circle cx={200 + 12} cy={topCy - 7} r="5" fill="#1E2A44" />
                      </g>
                    )}

                    {/* Handcrafted French Macarons */}
                    {hasTopping('top_macarons') && (
                      <g id="macarons">
                        {/* Macaron 1 */}
                        <g transform={`translate(${200 - topRadiusX * 0.4}, ${topCy - 18}) rotate(-12)`}>
                          <rect x="-14" y="-8" width="28" height="6" rx="3" fill="#D8A4B8" />
                          <rect x="-13" y="-3" width="26" height="3" fill="#FFF5EB" />
                          <rect x="-14" y="-1" width="28" height="6" rx="3" fill="#D8A4B8" />
                        </g>
                        {/* Macaron 2 */}
                        <g transform={`translate(${200 + topRadiusX * 0.4}, ${topCy - 15}) rotate(16)`}>
                          <rect x="-13" y="-8" width="26" height="6" rx="3" fill="#B4C9AF" />
                          <rect x="-12" y="-3" width="24" height="3" fill="#FFF8F0" />
                          <rect x="-13" y="-1" width="26" height="6" rx="3" fill="#B4C9AF" />
                        </g>
                      </g>
                    )}

                    {/* Edible Pressed Wildflowers */}
                    {hasTopping('top_wildflowers') && (
                      <g id="wildflowers">
                        {/* Pansy violet flower */}
                        <g transform={`translate(${200 - topRadiusX * 0.15}, ${topCy - 12})`}>
                          <circle cx="-5" cy="-5" r="5" fill="#5F4B8B" opacity="0.9" />
                          <circle cx="5" cy="-5" r="5" fill="#5F4B8B" opacity="0.9" />
                          <circle cx="0" cy="5" r="6" fill="#FFC837" opacity="0.95" />
                          <circle cx="0" cy="0" r="2.5" fill="#3D1E6D" />
                        </g>
                        {/* Cornflower blue petal spray */}
                        <g transform={`translate(${200 + topRadiusX * 0.25}, ${topCy - 10})`}>
                          <circle cx="-4" cy="0" r="4.5" fill="#4B779A" />
                          <circle cx="4" cy="0" r="4.5" fill="#4B779A" />
                          <circle cx="0" cy="-4" r="4.5" fill="#5C8EB3" />
                          <circle cx="0" cy="4" r="4.5" fill="#396180" />
                          <circle cx="0" cy="0" r="2" fill="#E8D588" />
                        </g>
                      </g>
                    )}

                    {/* Mission Figs & Rosemary */}
                    {hasTopping('top_figs_rosemary') && (
                      <g id="figs-rosemary">
                        {/* Rosemary Needle Sprig */}
                        <path
                          d={`M ${200 + 5} ${topCy - 2} Q ${200 + 25} ${topCy - 20}, ${200 + 40} ${topCy - 25}`}
                          stroke="#385E38"
                          strokeWidth="2.5"
                          fill="none"
                        />
                        <path
                          d={`M ${200 + 15} ${topCy - 8} L ${200 + 22} ${topCy - 16} M ${200 + 24} ${topCy - 15} L ${200 + 34} ${topCy - 20}`}
                          stroke="#487848"
                          strokeWidth="1.8"
                        />
                        {/* Halved Fig */}
                        <g transform={`translate(${200 - topRadiusX * 0.2}, ${topCy - 14})`}>
                          {/* Dark skin */}
                          <ellipse cx="0" cy="0" rx="10" ry="14" fill="#3A2B3B" />
                          {/* Red pulp */}
                          <ellipse cx="1" cy="0" rx="8" ry="11" fill="#C43D54" />
                          <circle cx="1" cy="0" r="4" fill="#E8A3AC" />
                        </g>
                      </g>
                    )}

                    {/* Sculpted Chocolate Shards */}
                    {hasTopping('top_chocolate_shards') && (
                      <g id="chocolate-shards">
                        <polygon
                          points={`${200 - 15},${topCy - 4} ${200 - 2},${topCy - 38} ${200 + 10},${topCy - 6}`}
                          fill="#261714"
                          stroke="#402823"
                          strokeWidth="1"
                        />
                        <polygon
                          points={`${200 - 5},${topCy - 2} ${200 + 16},${topCy - 48} ${200 + 25},${topCy - 8}`}
                          fill="#38221D"
                          stroke="#543730"
                          strokeWidth="1"
                        />
                      </g>
                    )}

                    {/* Meringue Kisses */}
                    {hasTopping('top_meringue_kisses') && (
                      <g id="meringue-kisses">
                        <path
                          d={`M ${200 - 18} ${topCy - 4} Q ${200 - 18} ${topCy - 18}, ${200 - 12} ${topCy - 22} Q ${200 - 6} ${topCy - 18}, ${200 - 6} ${topCy - 4} Z`}
                          fill="#FFFDF7"
                          stroke="#E8DCB8"
                          strokeWidth="1"
                        />
                        <path
                          d={`M ${200 + 10} ${topCy - 2} Q ${200 + 10} ${topCy - 16}, ${200 + 16} ${topCy - 20} Q ${200 + 22} ${topCy - 16}, ${200 + 22} ${topCy - 2} Z`}
                          fill="#FFFDF7"
                          stroke="#E8DCB8"
                          strokeWidth="1"
                        />
                      </g>
                    )}
                  </g>
                );
              })()}

              {/* CUSTOM INSCRIPTION DISPLAY */}
              {config.inscription.text && (
                <g id="inscription-overlay">
                  {config.inscription.style === 'sugar_plaque' ? (
                    // Sugar Plaque
                    <g transform="translate(200, 275)">
                      <rect
                        x="-70"
                        y="-14"
                        width="140"
                        height="28"
                        rx="14"
                        fill="#FFFDF9"
                        stroke="#D5CBB9"
                        strokeWidth="1.2"
                        filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.12))"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fontFamily="Playfair Display, Georgia, serif"
                        fontStyle="italic"
                        fontWeight="600"
                        fontSize="11"
                        fill={config.inscription.color || '#3B3632'}
                      >
                        {config.inscription.text.slice(0, 28)}
                      </text>
                    </g>
                  ) : config.inscription.style === 'acrylic_topper' ? (
                    // Laser cut topper standing on top
                    <g transform={`translate(200, ${tier.tiersCount === 3 ? 75 : tier.tiersCount === 2 ? 140 : 215})`}>
                      {/* Stick */}
                      <line x1="0" y1="0" x2="0" y2="28" stroke="#A89B85" strokeWidth="2.5" />
                      <circle cx="0" cy="-12" r="28" fill="#F8F3EA" stroke="#C5B79F" strokeWidth="1.5" />
                      <text
                        x="0"
                        y="-8"
                        textAnchor="middle"
                        fontFamily="Playfair Display, Georgia, serif"
                        fontWeight="700"
                        fontSize="9"
                        fill={config.inscription.color || '#A08048'}
                      >
                        {config.inscription.text.slice(0, 20)}
                      </text>
                    </g>
                  ) : (
                    // Hand-piped cursive script on the cake wall
                    <g transform={`translate(200, ${tier.tiersCount === 1 ? 285 : 210})`}>
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fontFamily="Playfair Display, Georgia, serif"
                        fontStyle="italic"
                        fontWeight="600"
                        fontSize="13"
                        fill={config.inscription.color || '#3B3632'}
                        style={{ letterSpacing: '0.04em' }}
                      >
                        {config.inscription.text.slice(0, 26)}
                      </text>
                    </g>
                  )}
                </g>
              )}
            </g>
          )}

          {/* VIEW MODE: CROSS-SECTION CUTAWAY */}
          {viewMode === 'cutaway' && (
            <g id="cake-cutaway">
              {/* Back half of exterior for context */}
              <ellipse
                cx="200"
                cy="250"
                rx="125"
                ry="22"
                fill={color.hex}
                stroke={color.borderHex}
                strokeWidth="1.5"
              />

              {/* Cross-section slice showing the 4 layers of sponge and 3 layers of filling */}
              <g id="layers-stack" transform="translate(90, 250)">
                <rect x="0" y="0" width="220" height="74" fill={color.hex} opacity="0.3" />

                {/* Layer 1 (Top Sponge) */}
                <rect x="10" y="5" width="200" height="12" rx="2" fill={spongeColor} />
                {/* Filling 1 */}
                <rect x="12" y="18" width="196" height="6" rx="1.5" fill={fillingColor} />

                {/* Layer 2 Sponge */}
                <rect x="10" y="25" width="200" height="12" rx="2" fill={spongeColor} />
                {/* Filling 2 */}
                <rect x="12" y="38" width="196" height="6" rx="1.5" fill={fillingColor} />

                {/* Layer 3 Sponge */}
                <rect x="10" y="45" width="200" height="12" rx="2" fill={spongeColor} />
                {/* Filling 3 */}
                <rect x="12" y="58" width="196" height="6" rx="1.5" fill={fillingColor} />

                {/* Layer 4 Base Sponge */}
                <rect x="10" y="65" width="200" height="12" rx="2" fill={spongeColor} />

                {/* Outer Swiss Meringue Buttercream Shell callouts */}
                <rect x="0" y="0" width="10" height="80" fill={color.hex} stroke={color.borderHex} strokeWidth="1" />
                <rect x="210" y="0" width="10" height="80" fill={color.hex} stroke={color.borderHex} strokeWidth="1" />
              </g>

              {/* Callout Labels on Cutaway */}
              <g id="cutaway-annotations" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
                {/* Sponge label */}
                <line x1="60" y1="262" x2="98" y2="262" stroke="#78716C" strokeWidth="1" strokeDasharray="2 2" />
                <text x="56" y="265" textAnchor="end" fill="#44403C" fontWeight="500">
                  {sponge.name}
                </text>

                {/* Filling label */}
                <line x1="335" y1="288" x2="295" y2="288" stroke="#78716C" strokeWidth="1" strokeDasharray="2 2" />
                <text x="340" y="291" textAnchor="start" fill="#44403C" fontWeight="500">
                  {filling.name}
                </text>

                {/* Exterior Frosting label */}
                <line x1="335" y1="318" x2="305" y2="318" stroke="#78716C" strokeWidth="1" strokeDasharray="2 2" />
                <text x="340" y="321" textAnchor="start" fill="#44403C" fontWeight="500">
                  {frostingStyle.name} ({color.name})
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Visualizer Bottom Detail Strip */}
      <div className="w-full flex items-center justify-between pt-3 border-t border-stone-200/80 text-xs text-stone-600 z-10">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Handcrafted to order with French cultured butter</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-bold text-stone-900 tabular-nums">
            ${config.estimatedPrice}
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500">Includes decor</span>
        </div>
      </div>
    </div>
  );
};
