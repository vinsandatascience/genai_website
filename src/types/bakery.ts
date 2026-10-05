export type CakeTierSize = 'single_6' | 'single_8' | 'single_10' | 'two_tier' | 'three_tier';
export type CakeShape = 'round' | 'square' | 'heart';

export interface TierOption {
  id: CakeTierSize;
  name: string;
  dimensions: string;
  servings: string;
  basePrice: number;
  tiersCount: number;
  description: string;
}

export interface FlavorOption {
  id: string;
  name: string;
  category: 'sponge' | 'filling' | 'frosting_style';
  price: number;
  description: string;
  colorCode?: string;
  dietaryNotes?: string[];
}

export interface ColorPaletteOption {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  description: string;
}

export interface DripOption {
  id: string;
  name: string;
  color: string;
  price: number;
}

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
  iconName: string;
  description: string;
}

export interface InscriptionOption {
  text: string;
  style: 'piped_cursive' | 'sugar_plaque' | 'acrylic_topper';
  color: string;
  price: number;
}

export interface CustomCakeConfiguration {
  occasion: string;
  tierSize: CakeTierSize;
  shape: CakeShape;
  spongeFlavorId: string;
  fillingFlavorId: string;
  frostingStyleId: string;
  frostingColorId: string;
  dripId: string;
  selectedToppingIds: string[];
  inscription: InscriptionOption;
  dietaryRequirements: string[];
  inspirationNotes: string;
  inspirationImageUrl?: string;
  estimatedPrice: number;
}

export interface SignatureCake {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  priceFrom: number;
  defaultConfig: Partial<CustomCakeConfiguration>;
  bestFor: string;
  allergens: string[];
}

export type OrderStatus = 'received' | 'design_confirmed' | 'baking' | 'decorating' | 'ready' | 'completed';

export interface BakeryOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  fulfillmentType: 'pickup' | 'delivery';
  fulfillmentDate: string;
  fulfillmentTimeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: {
    street: string;
    city: string;
    zipCode: string;
  };
  customCake: CustomCakeConfiguration;
  orderNotes?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}
