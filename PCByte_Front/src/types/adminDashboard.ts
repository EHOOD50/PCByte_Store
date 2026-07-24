export type AdminDashboardAlertType =
  | "ORDER"
  | "PRODUCT"
  | "SYSTEM";

export type AdminDashboardAlertLevel =
  | "CRITICAL"
  | "WARNING"
  | "INFO"
  | "SUCCESS";

export type AdminDashboardAlertAction =
  | "OPEN_ORDER"
  | "OPEN_PRODUCT"
  | "OPEN_CUSTOMER"
  | "OPEN_PAYMENT"
  | "NONE";

export interface AdminDashboardTopProduct {
  productId: number;
  name: string;
  imageUrl: string | null;
  unitsSold: number;
  revenue: number;
  currentStock: number;
}

export interface AdminDashboardDailySales {
  day: string;
  date: string;
  total: number;
}

export interface AdminDashboardLatestOrder {
  id: number;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface AdminDashboardAlert {
  code: string;
  type: AdminDashboardAlertType;
  level: AdminDashboardAlertLevel;
  title: string;
  description: string;
  referenceId: number | null;
  action: AdminDashboardAlertAction;
  createdAt: string;
}

export interface AdminDashboardData {
  salesToday: number;
  salesCurrentMonth: number;
  averageTicket: number;
  pendingOrders: number;
  pendingShipments: number | null;
  lowStockProducts: number;
  newCustomersToday: number | null;
  topProduct: AdminDashboardTopProduct | null;
  weeklySales: AdminDashboardDailySales[] | null;
  latestOrders: AdminDashboardLatestOrder[] | null;
  topProducts: AdminDashboardTopProduct[] | null;
  alerts: AdminDashboardAlert[] | null;
}