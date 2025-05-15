import React, { useRef, useState, useEffect } from "react";
import {
  Search,
  ListFilter,
  Check,
  Trash2,
  SquarePlus,
  Download,
} from "lucide-react";
import Button from "../Button";

// 컬럼 상태 인터페이스 정의
interface ColumnStateObject {
  [colId: string]: {
    headerName: string;
    hide: boolean;
  };
}

// Toolbar 컴포넌트 Props 인터페이스 정의
interface DataTableToolbarProps {
  fileName: React.ReactNode;
  edit?: boolean;
  download?: boolean;
  onAddNewRow: () => void;
  onRemoveSelected: () => void;
  onColumnVisibility: (field: string, hide: boolean) => void;
  onFilterTextChanged: (text: string) => void;
  onExcelDownload: () => void;
  getColumnsState: () => ColumnStateObject;
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  fileName = "",
  edit = false,
  download = false,
  onAddNewRow,
  onRemoveSelected,
  onColumnVisibility,
  onFilterTextChanged,
  onExcelDownload,
  getColumnsState,
}) => {
  // 내부 상태 관리
  const [isOpen, setIsOpen] = useState(false); // 컬럼 드롭다운
  const [quickFilterText, setQuickFilterText] = useState(""); // 검색어 상태
  const columnMenuRef = useRef<HTMLDivElement>(null); // 컬럼 필터링 참조를 위한 ref 생성
  const [columnVisibility, setColumnVisibility] = useState<ColumnStateObject>(
    {}
  );

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

  // 드롭다운 표시/숨김 함수
  const handleFilterColumn = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const columns = getColumnsState(); // 현재 컬럼 상태 가져오기
    setColumnVisibility(columns); // columnVisibility 상태 갱신
    setIsOpen(true);
  };

  // 컬럼 표시/숨김 상태 함수
  const handleColumnVisibility = (colId: string) => {
    const currentHideState = columnVisibility[colId].hide;
    onColumnVisibility(colId, !currentHideState);

    const updatedColumns = { ...columnVisibility };
    if (updatedColumns[colId]) {
      updatedColumns[colId] = {
        ...updatedColumns[colId],
        hide: !updatedColumns[colId].hide,
      };
    }

    // 상태 업데이트
    setColumnVisibility(updatedColumns);
  };

  // 검색 필터 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuickFilterText(newValue);
    onFilterTextChanged(newValue);
  };

  return (
    <div className="mb-2 flex justify-between items-end  w-full">
      {/* 파일 이름 */}
      <div className="">{fileName}</div>
      <div className="h-8 w-full flex items-center justify-end gap-2 text-gray-500">
        {edit && (
          <>
            {/* 행 추가 버튼 */}
            <button
              onClick={onAddNewRow}
              className="h-full flex items-center justify-center gap-1 px-2 text-sm hover:text-gray-700">
              <SquarePlus size={16} />
              <span>Add</span>
            </button>
            {/* 삭제 버튼 */}
            <button
              onClick={onRemoveSelected}
              className="h-full flex items-center justify-center gap-1 px-2 text-sm hover:text-gray-700">
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </>
        )}

        {/* 컬럼 필터 버튼 */}
        <div className="relative h-full" ref={columnMenuRef}>
          <button
            onClick={handleFilterColumn}
            className="h-full flex items-center justify-center gap-1 px-2 text-sm hover:text-gray-700">
            <ListFilter size={16} />
            <span>Columns</span>
          </button>
          {isOpen && (
            <div className="absolute right-2 w-32 max-h-64 overflow-y-auto bg-white rounded-md shadow-md z-10">
              {Object.entries(columnVisibility)
                // 전문가평가 항목 필터링
                .filter(([colId]) => !(colId === "evaluation"))
                .map(([colId, columnInfo]) => (
                  <div
                    key={colId}
                    className="flex items-center gap-2 px-3 py-2 m-1 rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleColumnVisibility(colId)}>
                    <div className="flex items-center justify-center w-4 h-4">
                      {!columnInfo.hide && (
                        <Check size={14} className="text-blue-600" />
                      )}
                    </div>
                    <span className="text-sm font-pretendard font-medium text-gray-700">
                      {columnInfo.headerName}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* 검색 영역 */}
        <div className="relative h-full w-1/4 min-w-40">
          <input
            type="text"
            value={quickFilterText}
            onChange={handleFilterChange}
            placeholder="Search"
            className="w-full h-full pl-8 pr-4 text-sm border border-gray-300 rounded-md"
          />
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>

        {/* 엑셀 다운로드 버튼 추가 */}
        {download && (
          <Button
            onClick={onExcelDownload}
            size="sm"
            icon={<Download size={16} />}>
            <span>Download</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataTableToolbar;
