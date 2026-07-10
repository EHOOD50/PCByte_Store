import { useEffect, useState } from "react";
import api from "../api/axios";

export interface MenuGroup {
  id: number | string;
  title: string;
  color: string;
  cats: string[];
}

export function useMenu() {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/config/menu");

      if (response.data?.configValue) {
        const parsedConfig = JSON.parse(response.data.configValue);
        setMenuGroups(Array.isArray(parsedConfig) ? parsedConfig : []);
      } else {
        setMenuGroups([]);
      }
    } catch (err) {
      console.error("Error cargando configuración de menú:", err);
      setError("No se pudo cargar el menú");
      setMenuGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return {
    menuGroups,
    loading,
    error,
    refetchMenu: fetchMenu,
  };
}