import { api } from "../utils/axios";
import type {
  MonthlySales,
  ProductCount,
  RegionRevenue,
  RevenueByCountry,
} from "../types/analytics";

// API endpoints matching Go backend routes
const ENDPOINTS = {
  REVENUE_BY_COUNTRY: "/api/revenue-by-country",
  TOP_PRODUCTS: "/api/products/top",
  TOP_REGIONS: "/api/regions/top",
  MONTHLY_SALES: "/api/sales/monthly",
  HEALTH: "/health",
} as const;

export const analyticsApi = {
  /**
   * Fetch revenue aggregated by country
   */
  getRevenueByCountry: async (): Promise<RevenueByCountry> => {
    const { data } = await api.get<RevenueByCountry>(
      ENDPOINTS.REVENUE_BY_COUNTRY
    );
    return data;
  },

  /**
   * Fetch top products by quantity sold
   */
  getTopProducts: async (): Promise<ProductCount> => {
    const { data } = await api.get<ProductCount>(ENDPOINTS.TOP_PRODUCTS);
    return data;
  },

  /**
   * Fetch top regions by revenue
   */
  getTopRegions: async (): Promise<RegionRevenue> => {
    const { data } = await api.get<RegionRevenue>(ENDPOINTS.TOP_REGIONS);
    return data;
  },

  /**
   * Fetch monthly sales volume data
   */
  getMonthlySales: async (): Promise<MonthlySales> => {
    const { data } = await api.get<MonthlySales>(ENDPOINTS.MONTHLY_SALES);
    return data;
  },

  /**
   * Check backend health status
   */
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const { data } = await api.get(ENDPOINTS.HEALTH);
    return data;
  },
};

export default analyticsApi;

