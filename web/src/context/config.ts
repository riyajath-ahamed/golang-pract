import type { AsyncState, CountryRevenue, DashboardStats, MonthlySalesResponse, MonthlySalesData, ProductCountResponse, ProductSales, RegionData, TopRegionsResponse, RevenueByCountryResponse, ETLStatusData } from "../types/analytics";
import type { ActionTypes } from "./actionType";

export interface AnalyticsState {
    revenueByCountry: AsyncState<RevenueByCountryResponse>;
    topProducts: AsyncState<ProductCountResponse>;
    topRegions: AsyncState<TopRegionsResponse>;
    monthlySales: AsyncState<MonthlySalesResponse>;
    etlStatus: AsyncState<ETLStatusData>;
  }


export type Action =
  | { type: typeof ActionTypes.FETCH_REVENUE_BY_COUNTRY_START }
  | { type: typeof ActionTypes.FETCH_REVENUE_BY_COUNTRY_SUCCESS; payload: RevenueByCountryResponse }
  | { type: typeof ActionTypes.FETCH_REVENUE_BY_COUNTRY_ERROR; payload: string }
  | { type: typeof ActionTypes.FETCH_TOP_PRODUCTS_START }
  | { type: typeof ActionTypes.FETCH_TOP_PRODUCTS_SUCCESS; payload: ProductCountResponse }
  | { type: typeof ActionTypes.FETCH_TOP_PRODUCTS_ERROR; payload: string }
  | { type: typeof ActionTypes.FETCH_TOP_REGIONS_START }
  | { type: typeof ActionTypes.FETCH_TOP_REGIONS_SUCCESS; payload: TopRegionsResponse }
  | { type: typeof ActionTypes.FETCH_TOP_REGIONS_ERROR; payload: string }
  | { type: typeof ActionTypes.FETCH_MONTHLY_SALES_START }
  | { type: typeof ActionTypes.FETCH_MONTHLY_SALES_SUCCESS; payload: MonthlySalesResponse }
  | { type: typeof ActionTypes.FETCH_MONTHLY_SALES_ERROR; payload: string }
  | { type: typeof ActionTypes.FETCH_ETL_STATUS_START }
  | { type: typeof ActionTypes.FETCH_ETL_STATUS_SUCCESS; payload: ETLStatusData }
  | { type: typeof ActionTypes.FETCH_ETL_STATUS_ERROR; payload: string }
  | { type: typeof ActionTypes.RESET_STATE };


  export interface AnalyticsActions {
    fetchRevenueByCountry: (force?: boolean) => Promise<void>;
    fetchTopProducts: (force?: boolean) => Promise<void>;
    fetchTopRegions: (force?: boolean) => Promise<void>;
    fetchMonthlySales: (force?: boolean) => Promise<void>;
    fetchETLStatus: (force?: boolean) => Promise<void>;
    fetchAllData: () => Promise<void>;
    refreshData: () => Promise<void>;
    resetState: () => void;
  }
  
  export interface AnalyticsGetters {  
    countryRevenueList: CountryRevenue[];
    productSalesList: ProductSales[];
    regionDataList: RegionData[];
    monthlySalesData: MonthlySalesData[];
    dashboardStats: DashboardStats;
    isAnyLoading: boolean;
    hasAnyError: boolean;
  }
  
  export type AnalyticsContextType = AnalyticsState & AnalyticsActions & AnalyticsGetters;
  