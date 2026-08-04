export type SystemServiceStatus =
  | "UP"
  | "DOWN"
  | "DEGRADED"
  | "UNKNOWN";

export interface SystemServiceStatusData {
  key: string;
  name: string;
  category: string;
  status: SystemServiceStatus;
  message: string;
  responseTimeMs: number;
}

export interface SystemStatusData {
  overallStatus: SystemServiceStatus;
  checkedAt: string;
  services: SystemServiceStatusData[];
}