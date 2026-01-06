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

  const fetchRevenueByCountry = useCallback(async () => {
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
  }, []);

  const fetchTopProducts = useCallback(async () => {
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
  }, []);

  const fetchTopRegions = useCallback(async () => {
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
  }, []);

  const fetchMonthlySales = useCallback(async () => {
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
  }, []);

  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchRevenueByCountry(),
      fetchTopProducts(),
      fetchTopRegions(),
      fetchMonthlySales(),
    ]);
  }, [
    fetchRevenueByCountry,
    fetchTopProducts,
    fetchTopRegions,
    fetchMonthlySales,
  ]);

  const refreshData = fetchAllData;

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
      state.monthlySales.isLoading,
    [
      state.revenueByCountry.isLoading,
      state.topProducts.isLoading,
      state.topRegions.isLoading,
      state.monthlySales.isLoading,
    ]
  );

  const hasAnyError = useMemo(
    () =>
      !!(
        state.revenueByCountry.error ||
        state.topProducts.error ||
        state.topRegions.error ||
        state.monthlySales.error
      ),
    [
      state.revenueByCountry.error,
      state.topProducts.error,
      state.topRegions.error,
      state.monthlySales.error,
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
      // Actions
      fetchRevenueByCountry,
      fetchTopProducts,
      fetchTopRegions,
      fetchMonthlySales,
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
      fetchAllData,
      refreshData,
      resetState,
      countryRevenueList,
      productSalesList,
      regionDataList,
      monthlySalesData,
      dashboardStats,
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
