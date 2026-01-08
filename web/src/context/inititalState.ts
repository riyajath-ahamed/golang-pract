import type { AsyncState, MonthlySalesResponse, ProductCountResponse, TopRegionsResponse, RevenueByCountryResponse, ETLStatusData } from "../types/analytics";
import type { AnalyticsState } from "./config";

const createInitialAsyncState = <T,>(): AsyncState<T> => ({
    data: null,
    isLoading: false,
    error: null,
  });

export const initialState: AnalyticsState = {
    revenueByCountry: createInitialAsyncState<RevenueByCountryResponse>(),
    topProducts: createInitialAsyncState<ProductCountResponse>(),
    topRegions: createInitialAsyncState<TopRegionsResponse>(),
    monthlySales: createInitialAsyncState<MonthlySalesResponse>(),
    etlStatus: createInitialAsyncState<ETLStatusData>(),
  };