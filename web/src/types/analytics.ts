// API Response Types matching Go backend structures

// Product within a country's data
export interface CountryProduct {
  Country: string;
  ProductName: string;
  TotalRevenue: number;
  Transactions: number;
  TransactionCount: number;
}

// Single country data item
export interface CountryData {
  country: string;
  total_revenue: number;
  total_transactions: number;
  total_products: number;
  products: CountryProduct[];
}

// Revenue by Country API response
export interface RevenueByCountryResponse {
  data: CountryData[];
  page: number;
  page_size: number;
  products_limit: number;
  total_items: number;
}

// Single product data item from API (PascalCase to match Go JSON)
export interface ProductCountItem {
  Product: string;
  Count: number;
  Stock: number;
}

// Top Products API response
export interface ProductCountResponse {
  data: ProductCountItem[];
  page: number;
  page_size: number;
  total_items: number;
}

export interface RegionDataItem {
  region: string;
  revenue: number;
  items_sold: number;
}


export interface TopRegionsResponse {
  data: RegionDataItem[];
  page: number;
  page_size: number;
  total_items: number;
}

export interface MonthlySalesItem {
  month: string;
  sales: number;
}

export interface MonthlySalesResponse {
  data: MonthlySalesItem[];
  page: number;
  page_size: number;
  total_items: number;
}

export interface CountryRevenue {
  country: string;
  revenue: number;
  totalTransactions: number;
  totalProducts: number;
  products: CountryProduct[];
}

export interface ProductSales {
  product: string;
  count: number;
  stock: number;
}

export interface RegionData {
  region: string;
  revenue: number;
  itemsSold: number;
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

