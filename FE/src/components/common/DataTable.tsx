import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from "@tanstack/react-table";
import { ListFilter, Check, Search, X } from "lucide-react";

interface DataTableProps {
  data: any[];
  fileName: String;
  isLoading?: boolean;
  error?: string | null;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  fileName,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p>파일 데이터를 처리 중입니다...</p>
      </div>
    );
  }

  // 오류가 있다면
  if (error) {
    return (
      <div className="h-96 overflow-auto">
        <div className="mb-4 text-red-500">
          <p>
            <strong>오류:</strong> {error}
          </p>
        </div>
      </div>
    );
  }

  // 데이터가 없다면
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p>파일에 데이터가 없습니다.</p>
      </div>
    );
  }

  // 데이터의 첫 번째 행에서 컬럼 정보 자동 생성
  const columnHelper = createColumnHelper<any>();

  // 데이터의 첫 번째 행에서 키를 추출
  const keys = useMemo(() => Object.keys(data[0]), [data]);

  // 초기 컬럼 가시성 상태 설정 - 모든 컬럼 보이기
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    keys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  // 드롭다운 표시 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // "모두 선택" 체크박스 상태
  const [allSelected, setAllSelected] = useState(true);

  // 검색어 상태 추가
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 드롭다운 참조 (외부 클릭 감지용)
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 모든 컬럼이 선택되었는지 확인하여 "모두 선택" 체크박스 상태 업데이트
  useEffect(() => {
    const allChecked = keys.every((key) => columnVisibility[key]);
    setAllSelected(allChecked);
  }, [columnVisibility, keys]);

  // 외부 클릭 감지 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 컬럼 가시성 토글 함수
  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  // 전체 선택/해제 토글 함수
  const toggleAllColumns = () => {
    const newValue = !allSelected;
    const newVisibility = keys.reduce(
      (acc, key) => ({ ...acc, [key]: newValue }),
      {}
    );
    setColumnVisibility(newVisibility);
    setAllSelected(newValue);
  };

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((row) => {
      return keys.some((key) => {
        const value = row[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, keys]);

  const columns = useMemo(() => {
    // 각 키에 대한 컬럼 정의 생성
    return keys.map((key) => {
      return columnHelper.accessor(key, {
        header: () => (
          <p className="text-left text-xs whitespace-nowrap text-gray-500">
            {key}
          </p>
        ),
        cell: (info) => (
          <p className="text-left text-sm whitespace-nowrap text-gray-500">
            {info.getValue()}
          </p>
        ),
        size: 150,
      });
    });
  }, [data]);

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 w-full h-full mt-5 p-3 border border-gray-200 rounded-lg shadow-sm bg-white overflow-auto">
      <header className="flex items-center justify-between">
        <h1 className="font-pretendard font-bold">{fileName}</h1>
        <div className="flex gap-5 justify-center items-center">
          {/* Column 필터 영역 */}
          <div
            className="flex relative items-center space-x-2"
            ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 h-8 text-sm font-semibold text-gray-500">
              <ListFilter className="h-4 w-4" />
              <span>Columns</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-8 z-10 w-52 max-h-72 p-1 bg-white border border-gray-200 rounded-md overflow-auto">
                {/* 전체 선택 */}
                <div
                  className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100/80 rounded-md"
                  onClick={toggleAllColumns}>
                  {allSelected ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4"></div>
                  )}
                  <span className="text-sm font-pretendard">(모두 선택)</span>
                </div>

                {/* 개별 컬럼 선택 */}
                {keys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100/80 rounded-md "
                    onClick={() => toggleColumnVisibility(key)}>
                    {columnVisibility[key] ? (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 flex-shrink-0"></div>
                    )}
                    <span className="text-sm font-pretendard text-nowrap">
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 검색 영역 */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="w-56 h-8 pl-7 pr-3 py-1 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <Search
              className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 opacity-40"
              strokeWidth={3}
            />
          </div>
        </div>
      </header>

      {/* 테이블 부분 */}
      <div className="h-full overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
