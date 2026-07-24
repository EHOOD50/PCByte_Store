export interface ShippingRate {
  id?: number;

  name: string;

  region: string | null;

  city: string | null;

  shippingType: string;

  carrier: string | null;

  price: number;

  freeShippingFrom: number | null;

  estimatedMinDays: number;

  estimatedMaxDays: number;

  active: boolean;

  priority: number;

  createdAt?: string;

  updatedAt?: string;
}

export interface ShippingQuote {
  shippingRateId: number | null;

  shippingType: string;

  label: string;

  carrier: string | null;

  originalPrice: number;

  cost: number;

  freeShipping: boolean;

  freeShippingFrom: number | null;

  estimatedMinDays: number | null;

  estimatedMaxDays: number | null;

  available: boolean;

  message: string;
}