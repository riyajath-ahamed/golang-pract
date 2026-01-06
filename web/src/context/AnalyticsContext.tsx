import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { analyticsApi } from "../api";
import type {
  AsyncState,
  CountryRevenue,
  DashboardStats,
  MonthlySales,
  MonthlySalesData,
  ProductCount,
  ProductSales,
  RegionData,
  RegionRevenue,
  RevenueByCountry,
} from "../types/analytics";

// Month names for display
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Context state shape
interface AnalyticsState {
  revenueByCountry: AsyncState<RevenueByCountry>;
  topProducts: AsyncState<ProductCount>;
  topRegions: AsyncState<RegionRevenue>;
  monthlySales: AsyncState<MonthlySales>;
}

// Context actions
interface AnalyticsActions {
  fetchRevenueByCountry: () => Promise<void>;
  fetchTopProducts: () => Promise<void>;
  fetchTopRegions: () => Promise<void>;
  fetchMonthlySales: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

// Derived/computed data getters
interface AnalyticsGetters {
  countryRevenueList: CountryRevenue[];
  productSalesList: ProductSales[];
  regionDataList: RegionData[];
  monthlySalesData: MonthlySalesData[];
  dashboardStats: DashboardStats;
  isAnyLoading: boolean;
  hasAnyError: boolean;
}

type AnalyticsContextType = AnalyticsState & AnalyticsActions & AnalyticsGetters;

// Initial async state factory
const createInitialAsyncState = <T,>(): AsyncState<T> => ({
  data: null,
  isLoading: false,
  error: null,
});

// Context
const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// Provider component
export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  // State for each API resource
  const [revenueByCountry, setRevenueByCountry] = useState<
    AsyncState<RevenueByCountry>
  >(createInitialAsyncState());

  const [topProducts, setTopProducts] = useState<AsyncState<ProductCount>>(
    createInitialAsyncState()
  );

  const [topRegions, setTopRegions] = useState<AsyncState<RegionRevenue>>(
    createInitialAsyncState()
  );

  const [monthlySales, setMonthlySales] = useState<AsyncState<MonthlySales>>(
    createInitialAsyncState()
  );

  // Generic fetch handler to reduce boilerplate
  const fetchData = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      setState: React.Dispatch<React.SetStateAction<AsyncState<T>>>
    ) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await apiCall();
        setState({ data, isLoading: false, error: null });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      }
    },
    []
  );

  // Individual fetch functions
  const fetchRevenueByCountry = useCallback(async () => {
    await fetchData(analyticsApi.getRevenueByCountry, setRevenueByCountry);
  }, [fetchData]);

  const fetchTopProducts = useCallback(async () => {
    await fetchData(analyticsApi.getTopProducts, setTopProducts);
  }, [fetchData]);

  const fetchTopRegions = useCallback(async () => {
    await fetchData(analyticsApi.getTopRegions, setTopRegions);
  }, [fetchData]);

  const fetchMonthlySales = useCallback(async () => {
    await fetchData(analyticsApi.getMonthlySales, setMonthlySales);
  }, [fetchData]);

  // Fetch all data in parallel
  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchRevenueByCountry(),
      fetchTopProducts(),
      fetchTopRegions(),
      fetchMonthlySales(),
    ]);
  }, [fetchRevenueByCountry, fetchTopProducts, fetchTopRegions, fetchMonthlySales]);

  // Alias for fetchAllData - useful for refresh buttons
  const refreshData = fetchAllData;

  // Derived/computed data using useMemo for performance
  const countryRevenueList = useMemo((): CountryRevenue[] => {
    if (!revenueByCountry.data) return [];
    return Object.entries(revenueByCountry.data)
      .map(([country, revenue]) => ({ country, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [revenueByCountry.data]);

  const productSalesList = useMemo((): ProductSales[] => {
    if (!topProducts.data) return [];
    return Object.entries(topProducts.data)
      .map(([product, quantity]) => ({ product, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [topProducts.data]);

  const regionDataList = useMemo((): RegionData[] => {
    if (!topRegions.data) return [];
    return Object.entries(topRegions.data)
      .map(([region, revenue]) => ({ region, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [topRegions.data]);

  const monthlySalesData = useMemo((): MonthlySalesData[] => {
    if (!monthlySales.data || !Array.isArray(monthlySales.data)) return [];
    return monthlySales.data.map((sales, index) => ({
      month: MONTH_NAMES[index],
      sales,
    }));
  }, [monthlySales.data]);

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
      revenueByCountry.isLoading ||
      topProducts.isLoading ||
      topRegions.isLoading ||
      monthlySales.isLoading,
    [
      revenueByCountry.isLoading,
      topProducts.isLoading,
      topRegions.isLoading,
      monthlySales.isLoading,
    ]
  );

  const hasAnyError = useMemo(
    () =>
      !!(
        revenueByCountry.error ||
        topProducts.error ||
        topRegions.error ||
        monthlySales.error
      ),
    [
      revenueByCountry.error,
      topProducts.error,
      topRegions.error,
      monthlySales.error,
    ]
  );

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AnalyticsContextType>(
    () => ({
      // State
      revenueByCountry,
      topProducts,
      topRegions,
      monthlySales,
      // Actions
      fetchRevenueByCountry,
      fetchTopProducts,
      fetchTopRegions,
      fetchMonthlySales,
      fetchAllData,
      refreshData,
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
      revenueByCountry,
      topProducts,
      topRegions,
      monthlySales,
      fetchRevenueByCountry,
      fetchTopProducts,
      fetchTopRegions,
      fetchMonthlySales,
      fetchAllData,
      refreshData,
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

// Custom hook to use analytics context
export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};

// Specialized hooks for specific data slices (optional, for convenience)
export const useRevenueByCountry = () => {
  const { revenueByCountry, countryRevenueList, fetchRevenueByCountry } =
    useAnalytics();
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
  const { dashboardStats, isAnyLoading, hasAnyError, fetchAllData } =
    useAnalytics();
  return { stats: dashboardStats, isLoading: isAnyLoading, hasError: hasAnyError, refresh: fetchAllData };
};

