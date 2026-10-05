import {
  CustomCakeConfiguration,
  TierOption,
  FlavorOption,
  DripOption,
  ToppingOption,
} from '../types/bakery';
import {
  TIER_OPTIONS,
  SPONGE_FLAVORS,
  FILLING_FLAVORS,
  FROSTING_STYLES,
  DRIP_OPTIONS,
  TOPPING_OPTIONS,
} from '../data/bakeryData';

export interface PriceBreakdown {
  tierBase: { name: string; price: number };
  shapeSurcharge: { name: string; price: number };
  sponge: { name: string; price: number };
  filling: { name: string; price: number };
  frostingStyle: { name: string; price: number };
  drip: { name: string; price: number };
  toppings: { name: string; price: number }[];
  inscription: { name: string; price: number };
  subtotal: number;
}

export function calculateCakePrice(config: CustomCakeConfiguration): PriceBreakdown {
  const tier = TIER_OPTIONS.find((t) => t.id === config.tierSize) || TIER_OPTIONS[1];
  const sponge = SPONGE_FLAVORS.find((s) => s.id === config.spongeFlavorId) || SPONGE_FLAVORS[0];
  const filling = FILLING_FLAVORS.find((f) => f.id === config.fillingFlavorId) || FILLING_FLAVORS[0];
  const frostingStyle = FROSTING_STYLES.find((s) => s.id === config.frostingStyleId) || FROSTING_STYLES[0];
  const drip = DRIP_OPTIONS.find((d) => d.id === config.dripId) || DRIP_OPTIONS[0];

  const shapePrice = config.shape === 'heart' ? 12 : config.shape === 'square' ? 8 : 0;
  const shapeName = config.shape === 'heart' ? 'Specialty Heart Tin' : config.shape === 'square' ? 'Clean Square Geometry' : 'Classic Round';

  const toppingsList = config.selectedToppingIds.map((id) => {
    const item = TOPPING_OPTIONS.find((top) => top.id === id);
    return {
      name: item ? item.name : id,
      price: item ? item.price : 0,
    };
  });

  const inscriptionPrice = config.inscription.text.trim().length > 0 ? config.inscription.price : 0;

  const subtotal =
    tier.basePrice +
    shapePrice +
    sponge.price +
    filling.price +
    frostingStyle.price +
    drip.price +
    toppingsList.reduce((acc, curr) => acc + curr.price, 0) +
    inscriptionPrice;

  return {
    tierBase: { name: tier.name, price: tier.basePrice },
    shapeSurcharge: { name: shapeName, price: shapePrice },
    sponge: { name: sponge.name, price: sponge.price },
    filling: { name: filling.name, price: filling.price },
    frostingStyle: { name: frostingStyle.name, price: frostingStyle.price },
    drip: { name: drip.name, price: drip.price },
    toppings: toppingsList,
    inscription: {
      name: config.inscription.text ? `Inscription: "${config.inscription.text}"` : 'No Inscription',
      price: inscriptionPrice,
    },
    subtotal,
  };
}
