import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  // 데이터의 첫 번째 행에서 컬럼 정보 자동 생성
  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(() => {
    // 데이터의 첫 번째 행에서 키를 추출
    const keys = Object.keys(data[0]);

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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto h-full">
        <table className="min-w-full  divide-y divide-gray-200">
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
