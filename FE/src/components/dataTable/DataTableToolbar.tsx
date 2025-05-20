import React, { useRef, useState, useEffect } from "react";
import {
  Search,
  ListFilter,
  Check,
  Trash2,
  SquarePlus,
  Download,
} from "lucide-react";
import Button from "../common/Button";
import AddRowModal from "../Step2/AddRowModal";

// 컬럼 상태 인터페이스 정의
interface ColumnState {
  colId: string;
  headerName: string;
  hide: boolean;
}

// Toolbar 컴포넌트 Props 인터페이스 정의
interface DataTableToolbarProps {
  fileName: React.ReactNode;
  edit?: boolean;
  download?: boolean;
  onAddNewRow: (rowData: Record<string, any>) => void;
  onRemoveSelected: () => void;
  onColumnVisibility: (state: { colId: string; hide: boolean }[]) => void;
  onAllColumnsVisibility: (hide: boolean) => void;
  onFilterTextChanged: (text: string) => void;
  onExcelDownload: () => void;
  getColumnsState: () => {
    visibleColumns: ColumnState[];
    hiddenColumns: ColumnState[];
  };
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  fileName = "",
  edit = false,
  download = false,
  onAddNewRow,
  onRemoveSelected,
  onColumnVisibility,
  onAllColumnsVisibility,
  onFilterTextChanged,
  onExcelDownload,
  getColumnsState,
}) => {
  // 내부 상태 관리
  const columnMenuRef = useRef<HTMLDivElement>(null); // 컬럼 필터링 참조를 위한 ref 생성
  const [isOpen, setIsOpen] = useState(false); // 컬럼 드롭다운
  const [visibleColumns, setVisibleColumns] = useState<ColumnState[]>([]); // 표시 컬럼
  const [hiddenColumns, setHiddenColumns] = useState<ColumnState[]>([]); // 표시되지 않는 컬럼
  const [allSelected, setAllSelected] = useState<boolean>(true); // 컬럼 전체 선택

  const [quickFilterText, setQuickFilterText] = useState(""); // 검색어 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기 함수
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 새 행 추가 함수 (모달에서 입력받은 데이터로 행 추가)
  const handleAddRow = (rowData: Record<string, any>) => {
    onAddNewRow(rowData);
  };

  // 외부 클릭 감지 - 컬럼 드롭다운 닫기
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

  // 컬럼 버튼 클릭시 드롭다운 표시 함수
  const handleFilterColumn = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const columns = getColumnsState(); // 현재 컬럼 상태 가져오기
    setVisibleColumns(columns.visibleColumns);
    setHiddenColumns(columns.hiddenColumns);

    setIsOpen(true);
  };

  // 전체 선택/해제 함수
  const handleSelectAll = () => {
    // 현재 상태의 반대로 설정
    const newSelectAllState = !allSelected;

    // 모든 컬럼 상태 업데이트
    const updatedColumns = visibleColumns.map((col) => ({
      ...col,
      hide: !newSelectAllState, // 전체 선택이면 hide=false, 아니면 hide=true
    }));

    // 상태 업데이트
    setVisibleColumns(updatedColumns);
    setAllSelected(newSelectAllState),
      // 모든 컬럼에 대한 표시/숨김에 관한 테이블 업데이트
      onAllColumnsVisibility(!newSelectAllState);
  };

  // 개별 컬럼 표시/숨김 상태 함수
  const handleColumnVisibility = (colId: string, index: number) => {
    // colId의 현재 숨김 상태
    const currentHideState = visibleColumns[index].hide;

    // 배열 복사 후 업데이트
    const updatedColumns = [...visibleColumns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      hide: !currentHideState,
    };

    const allVisible = updatedColumns.every((col) => !col.hide); // 모든 컬럼이 선택되었는지 여부
    const allHidden = updatedColumns.every((col) => col.hide); // 모든 컬럼이 해제되었는지 여부

    // 상태 업데이트
    setAllSelected(allVisible);
    setVisibleColumns(updatedColumns);

    // 테이블 업데이트
    const state = [
      { colId, hide: !currentHideState },
      ...hiddenColumns.map((col) => ({ colId: col.colId, hide: allHidden })),
    ];
    onColumnVisibility(state);
  };

  // 검색 필터 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuickFilterText(newValue);
    onFilterTextChanged(newValue);
  };

  return (
    <div className="mb-2 flex justify-between items-end w-full">
      {/* 파일 이름 */}
      <div
        className={`flex-1 w-full min-w-20 font-pretendard font-medium ${
          typeof fileName === "string" ? "truncate h-8 flex items-center" : ""
        }`}>
        {fileName}
      </div>
      <div className="h-8 flex items-center justify-end gap-2 text-gray-500">
        {edit && (
          <>
            {/* 행 추가 버튼 */}
            <button
              onClick={handleOpenModal}
              className="h-full flex items-center justify-center gap-1 px-2 text-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300/80">
              <SquarePlus size={16} />
              <span>Add</span>
            </button>
            {/* 삭제 버튼 */}
            <button
              onClick={onRemoveSelected}
              className="h-full flex items-center justify-center gap-1 px-2 text-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300/80">
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </>
        )}

        {/* 컬럼 필터 버튼 */}
        <div className="relative h-full" ref={columnMenuRef}>
          <button
            onClick={handleFilterColumn}
            className={`h-full flex items-center justify-center gap-1 px-2 text-sm  ${
              allSelected
                ? " hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300/80"
                : "text-blue-400 hover:text-blue-500"
            }`}>
            <ListFilter size={16} />
            <span>Columns</span>
          </button>
          {!allSelected && (
            <div className="absolute top-1 right-0.5 w-1.5 h-1.5 bg-blue-300/50 rounded-full"></div>
          )}
          {isOpen && (
            <div className="absolute right-2 w-40 max-h-64 overflow-y-auto overflow-x-auto whitespace-nowrap bg-white dark:bg-[#23283D] rounded-md shadow-md z-10 no-scrollbar">
              {/* 전체 선택 옵션 추가 */}
              <div
                className="flex items-center gap-2 px-3 py-2 m-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/50 cursor-pointer border-b border-gray-200 dark:border-gray-700"
                onClick={handleSelectAll}>
                <div className="flex-shrink-0 flex items-center justify-center w-4 h-4">
                  {allSelected && <Check size={14} className="text-blue-600" />}
                </div>
                <span className="text-sm font-pretendard font-medium text-gray-700 dark:text-[#A7ACB4]">
                  전체 선택
                </span>
              </div>

              {/* 기존 컬럼 목록 */}
              {visibleColumns.map((column, index) => (
                <div
                  key={column.colId}
                  className="flex items-center gap-2 px-3 py-2 m-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/50 cursor-pointer"
                  onClick={() => handleColumnVisibility(column.colId, index)}>
                  <div className="flex-shrink-0 flex items-center justify-center w-4 h-4">
                    {!column.hide && (
                      <Check size={14} className="text-blue-600" />
                    )}
                  </div>
                  <span className="text-sm font-pretendard font-medium text-gray-700 dark:text-[#A7ACB4]">
                    {column.headerName || column.colId}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 검색 영역 */}
        <div className="relative h-full w-1/4 min-w-72">
          <input
            type="text"
            value={quickFilterText}
            onChange={handleFilterChange}
            placeholder="Search"
            className="w-full h-full pl-8 pr-4 text-sm border border-gray-300 rounded-md dark:text-[#A7ACB4] dark:bg-[#23283D] dark:border-gray-700"
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

        <AddRowModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddRow={handleAddRow}
        />
      </div>
    </div>
  );
};

export default DataTableToolbar;
