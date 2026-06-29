import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../types/types";

const API_BASE_URL = "http://192.168.100.226:8080/api";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductsError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/products?size=100`);
      const data =
        response.data?._embedded?.products ||
        response.data?.content ||
        response.data;

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
      setProductsError("No se pudieron cargar los productos");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    setProducts,
    loadingProducts,
    productsError,
    refetchProducts: fetchProducts,
  };
}