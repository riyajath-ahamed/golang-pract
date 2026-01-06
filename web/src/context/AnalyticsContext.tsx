import {
  useContext,
} from "react";
import type { AnalyticsContextType } from "./config";
import { AnalyticsContext } from "./analyticsContextProvider";

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};

export const useRevenueByCountry = () => {
  const { revenueByCountry, countryRevenueList, fetchRevenueByCountry } = useAnalytics();
  return { ...revenueByCountry, list: countryRevenueList, fetch: fetchRevenueByCountry };
};

export const useTopProducts = () => {
  const { topProducts, productSalesList, fetchTopProducts } = useAnalytics();
  return { ...topProducts, list: productSalesList, fetch: fetchTopProducts };
};

export const useTopRegions = () => {
  const { topRegions, regionDataList, fetchTopRegions } = useAnalytics();
  return { ...topRegions, list: regionDataList, fetch: fetchTopRegions };
};

export const useMonthlySalesData = () => {
  const { monthlySales, monthlySalesData, fetchMonthlySales } = useAnalytics();
  return { ...monthlySales, list: monthlySalesData, fetch: fetchMonthlySales };
};

export const useDashboardStats = () => {
  const { dashboardStats, isAnyLoading, hasAnyError, fetchAllData } = useAnalytics();
  return { stats: dashboardStats, isLoading: isAnyLoading, hasError: hasAnyError, refresh: fetchAllData };
};
