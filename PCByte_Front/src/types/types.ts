// src/types/types.ts
export interface Category {
  id?: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}