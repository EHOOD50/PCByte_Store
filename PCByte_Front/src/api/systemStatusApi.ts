import adminApi from "./adminApi";

import type {
  SystemStatusData,
} from "../types/systemStatus";

export const getSystemStatus =
  async (): Promise<SystemStatusData> => {
    const response =
      await adminApi.get<SystemStatusData>(
        "/admin/system/status"
      );

    return response.data;
  };