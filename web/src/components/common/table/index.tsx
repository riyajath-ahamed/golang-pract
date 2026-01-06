import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { useEffect, useMemo } from "react";
import { useRevenueByCountry } from "../../../context";
import type { CountryRevenue } from "../../../types";

ModuleRegistry.registerModules([AllCommunityModule]);

const CountryLevelRevenueTable = () => {
  const { list, isLoading, fetch } = useRevenueByCountry();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const colDefs = useMemo<ColDef<CountryRevenue>[]>(
    () => [
      { field: "country", headerName: "Country", sortable: true, filter: true },
      {
        field: "revenue",
        headerName: "Revenue",
        sortable: true,
        filter: true,
        valueFormatter: (params) =>
          params.value?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
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