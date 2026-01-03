import { createBrowserRouter, type RouteObject } from "react-router-dom";
import Layout from "../layout";
import { Dashboard, SalesVolume, RevenueRegions, FrequentlyPurchasedProducts, RevenueTable } from "../pages";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "revenue-table",
        element: <RevenueTable />,
      },
      {
        path: "frequently-purchased-products",
        element: <FrequentlyPurchasedProducts />,
      },
      {
        path: "sales-volume",
        element:<SalesVolume/>,
      },
      {
        path: "revenue-regions",
        element: <RevenueRegions />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

