import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Search } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableProps {
  rowData: any[];
  colDefs: ColDef[];
}

const DataTable: React.FC<DataTableProps> = ({ rowData, colDefs }) => {
  const gridRef = useRef<AgGridReact>(null);
  const [quickFilterText, setQuickFilterText] = useState("");

  const defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
  };

  return (
    <div className="flex flex-col h-full">
      {/* 검색 영역 */}
      <div className="mb-4">
        <div className="relative w-96">
          <input
            type="text"
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="w-full h-9 pl-10 pr-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="flex-1">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
        />
      </div>
    </div>
  );
};

export default DataTable;
