// src/types/types.ts

export interface Category {
  id?: number;
  name: string;
}

export interface Brand {
  id?: number;
  name: string;
}

export interface Product {
  id: number;

  internalCode?: string;
  sku?: string;
  mpn?: string;

  name: string;
  description?: string;
  specifications?: string;
  warranty?: string;

  price: number;
  stock: number;
  active?: boolean;

  imageUrl: string;

  category?: Category;
  categoryId?: number;
  categoryName?: string;

  brand?: Brand;
  brandId?: number | null;
  brandName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}