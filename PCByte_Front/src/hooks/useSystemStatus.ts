import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getSystemStatus,
} from "../api/systemStatusApi";

import type {
  SystemStatusData,
} from "../types/systemStatus";

const REFRESH_INTERVAL_MS =
  60_000;

export const useSystemStatus =
  () => {
    const [
      systemStatus,
      setSystemStatus,
    ] =
      useState<SystemStatusData | null>(
        null
      );

    const [
      loadingSystemStatus,
      setLoadingSystemStatus,
    ] = useState(true);

    const [
      systemStatusError,
      setSystemStatusError,
    ] =
      useState<string | null>(
        null
      );

    const loadSystemStatus =
      useCallback(async () => {
        try {
          setSystemStatusError(
            null
          );

          const response =
            await getSystemStatus();

          setSystemStatus(
            response
          );
        } catch (error) {
          console.error(
            "Error al consultar el estado del sistema:",
            error
          );

          /*
           * No mantenemos el último estado exitoso porque
           * podría mostrar servicios operativos cuando la
           * verificación actual ya no está disponible.
           */
          setSystemStatus(
            null
          );

          setSystemStatusError(
            "No fue posible verificar el estado del sistema."
          );
        } finally {
          setLoadingSystemStatus(
            false
          );
        }
      }, []);

    useEffect(() => {
      void loadSystemStatus();

      const intervalId =
        window.setInterval(
          () => {
            void loadSystemStatus();
          },
          REFRESH_INTERVAL_MS
        );

      return () => {
        window.clearInterval(
          intervalId
        );
      };
    }, [loadSystemStatus]);

    return {
      systemStatus,
      loadingSystemStatus,
      systemStatusError,
      reloadSystemStatus:
        loadSystemStatus,
    };
  };