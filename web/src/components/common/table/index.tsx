import { AgGridReact } from 'ag-grid-react'
import React, { useState } from 'react'
import type { ColDef } from "ag-grid-community";

type Props = {}

interface IRow {
    make: string;
    model: string;
    price: number;
    electric: boolean;
  }

const CountryLevelRevenueTable = (props: Props) => {
    const [rowData, setRowData] = useState<IRow[]>([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Mercedes", model: "EQA", price: 48890, electric: true },
        { make: "Fiat", model: "500", price: 15774, electric: false },
        { make: "Nissan", model: "Juke", price: 20675, electric: false },
      ]);

      const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" },
      ]);

      const defaultColDef: ColDef = {
        flex: 1,
      };
    
  return (
    <div style={{ height: 500 }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
        />
    </div>
  )
}

export default CountryLevelRevenueTable