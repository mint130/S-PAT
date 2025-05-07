import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  VisibilityState,
} from "@tanstack/react-table";
import { ListFilter, Check } from "lucide-react";

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
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
    data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col space-y-4 h-full overflow-auto">
      {/* 필터 아이콘 및 드롭다운 */}
      <div className="flex justify-end relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none">
          <ListFilter className="h-4 w-4 mr-1" />
          <span>Columns</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-10 z-10 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="p-3 max-h-72 overflow-y-auto">
              {/* 전체 선택 체크박스 */}
              <div
                className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-md"
                onClick={toggleAllColumns}>
                {allSelected ? (
                  <Check className="h-4 w-4 text-blue-500 mr-2" />
                ) : (
                  <div className="h-4 w-4 text-gray-400 mr-2"></div>
                )}
                <span className="text-sm font-medium">(모두 선택)</span>
              </div>

              <div className="my-2 border-t border-gray-200"></div>

              {/* 개별 컬럼 체크박스 */}
              <div className="space-y-1">
                {keys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-md"
                    onClick={() => toggleColumnVisibility(key)}>
                    {columnVisibility[key] ? (
                      <Check className="h-4 w-4 text-blue-500 mr-2" />
                    ) : (
                      <div className="h-4 w-4 text-gray-400 mr-2"></div>
                    )}
                    <span className="text-sm">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

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
