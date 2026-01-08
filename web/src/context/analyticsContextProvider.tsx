import {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { analyticsReducer } from "./reducer";
import { initialState } from "./inititalState";
import { ActionTypes } from "./actionType";
import analyticsApi from "../api";
import type {
  CountryRevenue,
  DashboardStats,
  ETLStatusData,
  MonthlySalesData,
  ProductSales,
  RegionData,
} from "../types";
import type { AnalyticsContextType } from "./config";

export const AnalyticsContext = createContext<AnalyticsContextType | null>(
  null
);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  // Fetch only if not already loaded and not currently loading
  const fetchRevenueByCountry = useCallback(async (force = false) => {
    // Skip if already loaded or loading (unless forced)
    if (!force && (state.revenueByCountry.data || state.revenueByCountry.isLoading)) {
      return;
    }
    dispatch({ type: ActionTypes.FETCH_REVENUE_BY_COUNTRY_START });
    try {
      const data = await analyticsApi.getRevenueByCountry();
      dispatch({
        type: ActionTypes.FETCH_REVENUE_BY_COUNTRY_SUCCESS,
        payload: data,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch revenue by country";
      dispatch({
        type: ActionTypes.FETCH_REVENUE_BY_COUNTRY_ERROR,
        payload: errorMessage,
      });
    }
  }, [state.revenueByCountry.data, state.revenueByCountry.isLoading]);

  const fetchTopProducts = useCallback(async (force = false) => {
    if (!force && (state.topProducts.data || state.topProducts.isLoading)) {
      return;
    }
    dispatch({ type: ActionTypes.FETCH_TOP_PRODUCTS_START });
    try {
      const data = await analyticsApi.getTopProducts();
      dispatch({
        type: ActionTypes.FETCH_TOP_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch top products";
      dispatch({
        type: ActionTypes.FETCH_TOP_PRODUCTS_ERROR,
        payload: errorMessage,
      });
    }
  }, [state.topProducts.data, state.topProducts.isLoading]);

  const fetchTopRegions = useCallback(async (force = false) => {
    if (!force && (state.topRegions.data || state.topRegions.isLoading)) {
      return;
    }
    dispatch({ type: ActionTypes.FETCH_TOP_REGIONS_START });
    try {
      const data = await analyticsApi.getTopRegions();
      dispatch({
        type: ActionTypes.FETCH_TOP_REGIONS_SUCCESS,
        payload: data,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch top regions";
      dispatch({
        type: ActionTypes.FETCH_TOP_REGIONS_ERROR,
        payload: errorMessage,
      });
    }
  }, [state.topRegions.data, state.topRegions.isLoading]);

  const fetchMonthlySales = useCallback(async (force = false) => {
    if (!force && (state.monthlySales.data || state.monthlySales.isLoading)) {
      return;
    }
    dispatch({ type: ActionTypes.FETCH_MONTHLY_SALES_START });
    try {
      const data = await analyticsApi.getMonthlySales();
      dispatch({
        type: ActionTypes.FETCH_MONTHLY_SALES_SUCCESS,
        payload: data,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch monthly sales";
      dispatch({
        type: ActionTypes.FETCH_MONTHLY_SALES_ERROR,
        payload: errorMessage,
      });
    }
  }, [state.monthlySales.data, state.monthlySales.isLoading]);

  const fetchETLStatus = useCallback(async (force = false) => {
    if (!force && (state.etlStatus.data || state.etlStatus.isLoading)) {
      return;
    }
    dispatch({ type: ActionTypes.FETCH_ETL_STATUS_START });
    try {
      const data = await analyticsApi.getETLStatus();
      dispatch({
        type: ActionTypes.FETCH_ETL_STATUS_SUCCESS,
        payload: data,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch ETL status";
      dispatch({
        type: ActionTypes.FETCH_ETL_STATUS_ERROR,
        payload: errorMessage,
      });
    }
  }, [state.etlStatus.data, state.etlStatus.isLoading]);

  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchRevenueByCountry(),
      fetchTopProducts(),
      fetchTopRegions(),
      fetchMonthlySales(),
      fetchETLStatus(),
    ]);
  }, [
    fetchRevenueByCountry,
    fetchTopProducts,
    fetchTopRegions,
    fetchMonthlySales,
    fetchETLStatus,
  ]);

  // Force refresh all data (bypasses cache check)
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchRevenueByCountry(true),
      fetchTopProducts(true),
      fetchTopRegions(true),
      fetchMonthlySales(true),
      fetchETLStatus(true),
    ]);
  }, [fetchRevenueByCountry, fetchTopProducts, fetchTopRegions, fetchMonthlySales, fetchETLStatus]);

  const resetState = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_STATE });
  }, []);

  const countryRevenueList = useMemo((): CountryRevenue[] => {
    if (!state.revenueByCountry.data?.data) return [];
    return state.revenueByCountry.data.data
      .map((item) => ({
        country: item.country,
        revenue: item.total_revenue,
        totalTransactions: item.total_transactions,
        totalProducts: item.total_products,
        products: item.products,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [state.revenueByCountry.data]);

  const productSalesList = useMemo((): ProductSales[] => {
    if (!state.topProducts.data?.data) return [];
    return state.topProducts.data.data
      .map((item) => ({
        product: item.Product,
        count: item.Count,
        stock: item.Stock,
      }))
      .sort((a, b) => b.count - a.count);
  }, [state.topProducts.data]);

  const regionDataList = useMemo((): RegionData[] => {
    if (!state.topRegions.data?.data) return [];
    return state.topRegions.data.data
      .map((item) => ({
        region: item.region,
        revenue: item.revenue,
        itemsSold: item.items_sold,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [state.topRegions.data]);

  const monthlySalesData = useMemo((): MonthlySalesData[] => {
    if (!state.monthlySales.data?.data) return [];
    return state.monthlySales.data.data.map((item) => ({
      month: item.month,
      sales: item.sales,
    }));
  }, [state.monthlySales.data]);

  const etlStatusData = useMemo((): ETLStatusData | null => {
    return state.etlStatus.data;
  }, [state.etlStatus.data]);

  const dashboardStats = useMemo((): DashboardStats => {
    return {
      totalCountries: countryRevenueList.length,
      totalRegions: regionDataList.length,
      totalProducts: productSalesList.length,
      totalTransactions: monthlySalesData.reduce((sum, m) => sum + m.sales, 0),
    };
  }, [countryRevenueList, regionDataList, productSalesList, monthlySalesData]);

  const isAnyLoading = useMemo(
    () =>
      state.revenueByCountry.isLoading ||
      state.topProducts.isLoading ||
      state.topRegions.isLoading ||
      state.monthlySales.isLoading ||
      state.etlStatus.isLoading,
    [
      state.revenueByCountry.isLoading,
      state.topProducts.isLoading,
      state.topRegions.isLoading,
      state.monthlySales.isLoading,
      state.etlStatus.isLoading,
    ]
  );

  const hasAnyError = useMemo(
    () =>
      !!(
        state.revenueByCountry.error ||
        state.topProducts.error ||
        state.topRegions.error ||
        state.monthlySales.error ||
        state.etlStatus.error
      ),
    [
      state.revenueByCountry.error,
      state.topProducts.error,
      state.topRegions.error,
      state.monthlySales.error,
      state.etlStatus.error,
    ]
  );

  // Memoize context value
  const value = useMemo<AnalyticsContextType>(
    () => ({
      // State
      revenueByCountry: state.revenueByCountry,
      topProducts: state.topProducts,
      topRegions: state.topRegions,
      monthlySales: state.monthlySales,
      etlStatus: state.etlStatus,
      // Actions
      fetchRevenueByCountry,
      fetchTopProducts,
      fetchTopRegions,
      fetchMonthlySales,
      fetchETLStatus,
      fetchAllData,
      refreshData,
      resetState,
      // Getters
      countryRevenueList,
      productSalesList,
      regionDataList,
      monthlySalesData,
      dashboardStats,
      isAnyLoading,
      hasAnyError,
    }),
    [
      state,
      fetchRevenueByCountry,
      fetchTopProducts,
      fetchTopRegions,
      fetchMonthlySales,
      fetchETLStatus,
      fetchAllData,
      refreshData,
      resetState,
      countryRevenueList,
      productSalesList,
      regionDataList,
      monthlySalesData,
      dashboardStats,
      etlStatusData,
      isAnyLoading,
      hasAnyError,
    ]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
