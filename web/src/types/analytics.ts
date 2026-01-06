// API Response Types matching Go backend structures

export type RevenueByCountry = Record<string, number>;

export type ProductCount = Record<string, number>;

export type RegionRevenue = Record<string, number>;

export type MonthlySales = number[];

// Derived types for UI display
export interface CountryRevenue {
  country: string;
  revenue: number;
}

export interface ProductSales {
  product: string;
  quantity: number;
}

export interface RegionData {
  region: string;
  revenue: number;
}

export interface MonthlySalesData {
  month: string;
  sales: number;
}

// Dashboard summary stats
export interface DashboardStats {
  totalCountries: number;
  totalRegions: number;
  totalProducts: number;
  totalTransactions: number;
}

// API state for each resource
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

