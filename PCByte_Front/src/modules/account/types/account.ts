export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  id: number;

  fullName: string;

  email: string;

  phone: string;

  subtotal: number;

  shippingCost: number;

  total: number;

  shippingRateId: number | null;

  shippingType: string | null;

  shippingLabel: string | null;

  shippingCarrier: string | null;

  shippingFree: boolean;

  estimatedMinDays: number | null;

  estimatedMaxDays: number | null;

  status: string;

  createdAt: string;

  paymentId: string | null;

  street: string;

  number: string;

  apartment: string | null;

  city: string;

  region: string;

  extraInfo: string | null;

  items: OrderItem[];
}

export interface Address {
  id: number;

  street: string;

  number: string;

  apartment?: string;

  city: string;

  region: string;

  extraInfo?: string;
}

export interface AccountProfile {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;
}