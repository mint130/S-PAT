// DataTable.tsx
import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableProps {
  rowData: any[];
  colDefs: ColDef[];
}

const DataTable: React.FC<DataTableProps> = ({ rowData, colDefs }) => {
  const gridRef = useRef<AgGridReact>(null);

  const defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
  };

  return (
    <div className="h-screen w-full">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default DataTable;
