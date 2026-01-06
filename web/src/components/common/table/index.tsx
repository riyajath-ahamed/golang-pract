import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { useEffect, useMemo } from "react";
import { useRevenueByCountry } from "../../../context";
import type { CountryProduct, CountryRevenue } from "../../../types";
import CellRenderBadge from "./customCellRender/cellRenderBadge";

ModuleRegistry.registerModules([AllCommunityModule]);

const CountryLevelRevenueTable = () => {
  const { list, isLoading, fetch } = useRevenueByCountry();

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colDefs = useMemo<ColDef<CountryRevenue>[]>(
    () => [
      { field: "country", headerName: "Country", minWidth: 80, resize: false, flex: 0.5, sortable: true},
      {
        field: "products",
        headerName: "Products",
        resize: false,
        sortable: false,
        flex: 2,
        cellRendererSelector: (props: CustomCellRendererProps) => {
          return {
            component: CellRenderBadge,
            params: {
              products:
                props.data?.products.map(
                  (product: CountryProduct) => product.ProductName
                ) || [],
            },
          };
        },
      },
      {
        field: "revenue",
        headerName: "Total Revenue",
        sortable: true,
        minWidth: 100,
        flex: 1,
        resize: false,
        valueFormatter: (params) =>
          params.value?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
      },
      {
        field: "totalTransactions",
        headerName: "Total Transactions",
        resize: false,
        sortable: false,
        flex: 0.5,
      },
      {
        field: "totalProducts",
        headerName: "Total Products",
        resize: false,
        sortable: false,
      },
    ],
    []
  );

  const defaultColDef: ColDef = {
    flex: 1,
  };

  return (
    <div style={{ height: 500 }}>
      <AgGridReact
        rowData={list}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        loading={isLoading}
      />
    </div>
  );
};

export default CountryLevelRevenueTable;