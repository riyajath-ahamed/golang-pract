import { ActionTypes } from "./actionType";
import type { Action, AnalyticsState } from "./config";
import { initialState } from "./inititalState";

export const analyticsReducer = (state: AnalyticsState, action: Action): AnalyticsState => {
    switch (action.type) {
      // Revenue by Country
      case ActionTypes.FETCH_REVENUE_BY_COUNTRY_START:
        return {
          ...state,
          revenueByCountry: { ...state.revenueByCountry, isLoading: true, error: null },
        };
      case ActionTypes.FETCH_REVENUE_BY_COUNTRY_SUCCESS:
        return {
          ...state,
          revenueByCountry: { data: action.payload, isLoading: false, error: null },
        };
      case ActionTypes.FETCH_REVENUE_BY_COUNTRY_ERROR:
        return {
          ...state,
          revenueByCountry: { ...state.revenueByCountry, isLoading: false, error: action.payload },
        };
  
      // Top Products
      case ActionTypes.FETCH_TOP_PRODUCTS_START:
        return {
          ...state,
          topProducts: { ...state.topProducts, isLoading: true, error: null },
        };
      case ActionTypes.FETCH_TOP_PRODUCTS_SUCCESS:
        return {
          ...state,
          topProducts: { data: action.payload, isLoading: false, error: null },
        };
      case ActionTypes.FETCH_TOP_PRODUCTS_ERROR:
        return {
          ...state,
          topProducts: { ...state.topProducts, isLoading: false, error: action.payload },
        };
  
      // Top Regions
      case ActionTypes.FETCH_TOP_REGIONS_START:
        return {
          ...state,
          topRegions: { ...state.topRegions, isLoading: true, error: null },
        };
      case ActionTypes.FETCH_TOP_REGIONS_SUCCESS:
        return {
          ...state,
          topRegions: { data: action.payload, isLoading: false, error: null },
        };
      case ActionTypes.FETCH_TOP_REGIONS_ERROR:
        return {
          ...state,
          topRegions: { ...state.topRegions, isLoading: false, error: action.payload },
        };
  
      // Monthly Sales
      case ActionTypes.FETCH_MONTHLY_SALES_START:
        return {
          ...state,
          monthlySales: { ...state.monthlySales, isLoading: true, error: null },
        };
      case ActionTypes.FETCH_MONTHLY_SALES_SUCCESS:
        return {
          ...state,
          monthlySales: { data: action.payload, isLoading: false, error: null },
        };
      case ActionTypes.FETCH_MONTHLY_SALES_ERROR:
        return {
          ...state,
          monthlySales: { ...state.monthlySales, isLoading: false, error: action.payload },
        };
  
      // Reset
      case ActionTypes.RESET_STATE:
        return initialState;
  
      default:
        return state;
    }
  };