import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, RowSelectionOptions } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import {
  Search,
  ListFilter,
  Check,
  AlertCircle,
  Trash2,
  Plus,
  FileDown,
} from "lucide-react";
import * as XLSX from "xlsx";

ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableProps {
  rowData: any[];
  colDefs: ColDef[];
  edit?: boolean;
  gridRef?: React.RefObject<AgGridReact | null>;
  selectable?: boolean;
  setRowData?: React.Dispatch<React.SetStateAction<any[]>>;
}

// 컬럼 메뉴 컴포넌트 분리
interface ColumnMenuProps {
  colDefs: ColDef[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  onColumnChange: (field: string) => void;
}

const ColumnMenu: React.FC<ColumnMenuProps> = ({
  colDefs,
  columnVisibility,
  setColumnVisibility,
  onColumnChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  // 초기 컬럼 상태 설정
  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    colDefs.forEach((col) => {
      if (col.field) {
        initialVisibility[col.field] = true;
      }
    });
    setColumnVisibility(initialVisibility);
  }, [colDefs]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnMenuRef.current &&
        !columnMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={columnMenuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
        <ListFilter size={16} />
        <span>Columns</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <div className="max-h-64 overflow-y-auto">
              {colDefs.map((column) => {
                return (
                  <div
                    key={column.field}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onColumnChange(column.field!)}>
                    <div className="flex items-center justify-center w-4 h-4">
                      {columnVisibility[column.field!] && (
                        <Check size={14} className="text-blue-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {column.headerName || column.field}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DataTable: React.FC<DataTableProps> = ({
  rowData,
  colDefs,
  edit = false,
  gridRef: externalGridRef,
  selectable = false,
  setRowData,
}) => {
  const internalGridRef = useRef<AgGridReact>(null);
  const gridRef = externalGridRef || internalGridRef;
  const [quickFilterText, setQuickFilterText] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    editable: edit,
  };

  const rowSelection = useMemo<RowSelectionOptions | undefined>(() => {
    return selectable ? { mode: "multiRow" } : undefined;
  }, [selectable]);

  const toggleColumnVisibility = (field: string) => {
    // ag-grid API 업데이트
    gridRef.current!.api.setColumnsVisible([field], !columnVisibility[field]);
    // React 상태 업데이트
    setColumnVisibility((prev) => ({
      ...prev,
      [field]: !columnVisibility[field],
    }));
  };

  const onRemoveSelected = useCallback(() => {
    const selectedRowData = gridRef.current!.api.getSelectedRows();
    gridRef.current!.api.applyTransaction({ remove: selectedRowData });
  }, []);

  // 행 추가 함수
  const addNewRow = useCallback(() => {
    // 새 행을 위한 빈 객체 생성
    const newRow: Record<string, any> = {};

    // colDefs에서 모든 필드에 대해 기본값 설정
    colDefs.forEach((col) => {
      if (col.field) {
        newRow[col.field] = "";
      }
    });

    // AG Grid API를 사용하여 새 행 추가
    if (gridRef.current?.api) {
      gridRef.current.api.applyTransaction({
        add: [newRow],
      });
    }

    // 상위 컴포넌트의 상태도 업데이트 (제공된 경우)
    if (setRowData) {
      setRowData((currentRowData) => [...currentRowData, newRow]);
    }
  }, [colDefs, gridRef, setRowData]);

  // 엑셀 다운로드 함수 추가
  const handleExcelDownload = useCallback(() => {
    if (!gridRef.current?.api) return;

    // 모든 행 데이터 가져오기
    const exportData: any[] = [];
    gridRef.current.api.forEachNode((node) => {
      if (node.data) {
        exportData.push(node.data);
      }
    });

    // 엑셀 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 컬럼 헤더 이름 설정 (기본 필드명 대신 headerName 사용)
    const headerNames: any = {};
    const headers: string[] = [];

    colDefs.forEach((col, index) => {
      if (col.field) {
        const headerName = col.headerName || col.field;
        headers.push(headerName);
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
        headerNames[cellRef] = { v: headerName, t: "s" };
      }
    });

    // 워크시트에 헤더 정보 추가
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    // 열 너비 설정 (자동으로 조정)
    const columnWidths = colDefs.map(() => ({ wch: 15 })); // 기본값 15
    worksheet["!cols"] = columnWidths;

    // 엑셀 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "데이터");

    // 현재 날짜와 시간 포맷팅
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");

    // 엑셀 파일 다운로드
    const fileName = `데이터_${dateStr}_${timeStr}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }, [colDefs, gridRef]);

  return (
    <div className="flex flex-col h-full">
      {/* 상단 컨트롤 영역 */}
      <div className="mb-2 flex justify-end items-center gap-4">
        {/* 행 추가 버튼 */}
        {setRowData && (
          <button
            onClick={addNewRow}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-blue-600">
            <Plus size={16} />
            <span>행 추가</span>
          </button>
        )}

        {/* 컬럼 필터 버튼 */}
        <ColumnMenu
          colDefs={colDefs}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          onColumnChange={toggleColumnVisibility}
        />

        {/* 삭제 버튼 */}
        {selectable && (
          <button
            onClick={onRemoveSelected}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            <Trash2 size={16} />
            <span>삭제</span>
          </button>
        )}

        {/* 검색 영역 */}
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

        {/* 엑셀 다운로드 버튼 추가 */}
        <button
          onClick={handleExcelDownload}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-green-600">
          <FileDown size={16} />
          <span>엑셀 다운로드</span>
        </button>
      </div>

      {/* 테이블 영역 */}
      <div className="flex-1 relative">
        {false ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md">
            <AlertCircle className="text-gray-400 mb-3" size={48} />
            <h3 className="text-lg font-medium text-gray-600 mb-1">
              표시할 컬럼이 없습니다
            </h3>
            <p className="text-sm text-gray-500 text-center">
              "Columns" 버튼을 클릭하여
              <br />
              표시할 컬럼을 선택해주세요.
            </p>
          </div>
        ) : (
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            quickFilterText={quickFilterText}
            rowSelection={rowSelection}
          />
        )}
      </div>
    </div>
  );
};

export default DataTable;
