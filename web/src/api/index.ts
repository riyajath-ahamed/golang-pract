import { api } from "../utils/axios";
import type {
  MonthlySalesResponse,
  TopRegionsResponse,
  RevenueByCountryResponse,
  ProductCountResponse,
  ETLStatusResponse,
  ETLStatusData,
} from "../types/analytics";

// API endpoints matching Go backend routes
const ENDPOINTS = {
  REVENUE_BY_COUNTRY: "/api/revenue-by-country",
  TOP_PRODUCTS: "/api/top-products",
  TOP_REGIONS: "/api/top-regions",
  MONTHLY_SALES: "/api/monthly-sales",
  HEALTH: "/health",
  ETL_STATUS: "/etl-status",
} as const;

export const analyticsApi = {
  /**
   * Fetch revenue aggregated by country
   */
  getRevenueByCountry: async (): Promise<RevenueByCountryResponse> => {
    const { data } = await api.get<RevenueByCountryResponse>(
      ENDPOINTS.REVENUE_BY_COUNTRY
    );
    return data;
  },

  /**
   * Fetch top products by quantity sold
   */
  getTopProducts: async (): Promise<ProductCountResponse> => {
    const { data } = await api.get<ProductCountResponse>(
      ENDPOINTS.TOP_PRODUCTS
    );
    return data;
  },

  /**
   * Fetch top regions by revenue
   */
  getTopRegions: async (): Promise<TopRegionsResponse> => {
    const { data } = await api.get<TopRegionsResponse>(ENDPOINTS.TOP_REGIONS);
    return data;
  },

  /**
   * Fetch monthly sales volume data
   */
  getMonthlySales: async (): Promise<MonthlySalesResponse> => {
    const { data } = await api.get<MonthlySalesResponse>(
      ENDPOINTS.MONTHLY_SALES
    );
    return data;
  },

  /**
   * Check backend health status
   */
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const { data } = await api.get(ENDPOINTS.HEALTH);
    return data;
  },

  /**
   * Check ETL status
   */
  getETLStatus: async (): Promise<ETLStatusData> => {
    const { data } = await api.get<ETLStatusResponse>(ENDPOINTS.ETL_STATUS);
    return data.etl_status;
  },
};

export default analyticsApi;

