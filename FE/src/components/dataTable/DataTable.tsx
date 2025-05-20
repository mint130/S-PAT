import {
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  RowSelectionOptions,
  SelectionColumnDef,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  colorSchemeDarkWarm,
  SizeColumnsToContentStrategy,
} from "ag-grid-community";
import * as XLSX from "xlsx";
import DataTableToolbar from "./DataTableToolbar";
import useThemeStore from "../../stores/useThemeStore";

ModuleRegistry.registerModules([AllCommunityModule]);

// 컬럼 상태를 위한 인터페이스 정의
interface ColumnState {
  colId: string;
  headerName: string;
  hide: boolean;
}

// 데이터 테이블 Props 인터페이스 정의
interface DataTableProps {
  rowData: any[]; // 표시할 행 데이터 배열
  colDefs: ColDef[]; // 열 정의 배열
  edit?: boolean; // 편집 가능 여부 (기본값: false)
  fileName?: React.ReactNode; // 문자열이나 컴포넌트 모두 가능하도록 변경
  download?: boolean; // 다운로드 가능 여부 (기본값: false)
  loading?: boolean;
  handleExcelDownload?: () => Promise<void>; // 다운로드 api 연결할 경우 우선 적용할 함수
  onDataChanged?: (data: any[]) => void; // 전문가 점수에 필요
}

// DataTable 컴포넌트 정의 - forwardRef로 감싸서 외부 ref를 받음
const DataTable = forwardRef<AgGridReact, DataTableProps>(
  (
    {
      rowData,
      colDefs,
      edit = false,
      fileName = "",
      download = false,
      loading = false,
      handleExcelDownload,
      onDataChanged,
    },
    ref
  ) => {
    const gridRef = useRef<AgGridReact>(null); // 그리드 참조를 위한 내부 ref 생성
    const { isDarkMode } = useThemeStore(); // 다크모드 상태 가져오기

    // 외부 ref가 내부 gridRef를 직접 참조하도록 설정
    useImperativeHandle(ref, () => gridRef.current!);

    // 다크 모드 스타일
    const theme = useMemo(() => {
      return isDarkMode
        ? themeQuartz.withPart(colorSchemeDarkWarm).withParams({
            backgroundColor: "#141828",
            cellTextColor: "#C9C9C9",
            headerTextColor: "#C9C9C9",
          })
        : undefined;
    }, [isDarkMode]);

    // 기본 열 설정
    const defaultColDef: ColDef = {
      sortable: true, // 모든 열에 정렬 기능 활성화
      unSortIcon: true, // 정렬되지 않은 열에도 아이콘 표시
      resizable: true, // 열 크기 조절 가능
      editable: edit, // props로 전달된 edit 값따라 편집 가능 여부 설정
      minWidth: 100,
    };

    // 열 사이즈 설정 - 셀 내용에 맞게 자동 조정
    const autoSizeStrategy = useMemo<SizeColumnsToContentStrategy>(() => {
      return {
        type: "fitCellContents",
      };
    }, []);

    // 행 선택 설정 -다중 행 선택, 필터를 충족하는 모든 행 선택
    const rowSelection = useMemo<RowSelectionOptions | undefined>(() => {
      return edit ? { mode: "multiRow", selectAll: "filtered" } : undefined; // edit이 true일 때만 다중 행 선택 활성화
    }, [edit]);

    // 체크박스 열 설정
    const selectionColumnDef = useMemo<SelectionColumnDef>(() => {
      return {
        pinned: "left",
        lockPinned: true,
        minWidth: 50,
        maxWidth: 50,
      };
    }, []);

    // ----------------------------------------------------------------------------
    // 행 추가 함수
    const addNewRow = useCallback(
      (rowData: Record<string, any>) => {
        if (rowData) {
          const mappedData: Record<string, any> = {};

          if (colDefs.some((col) => col.field === "code")) {
            mappedData.code = rowData.code;
          }
          if (colDefs.some((col) => col.field === "level")) {
            mappedData.level = rowData.level;
          }
          if (colDefs.some((col) => col.field === "name")) {
            mappedData.name = rowData.name;
          }
          if (colDefs.some((col) => col.field === "description")) {
            mappedData.description = rowData.description;
          }

          gridRef.current?.api.applyTransaction({
            add: [mappedData],
          });
        }
      },
      [colDefs]
    );

    // 행 삭제 함수
    const onRemoveSelected = useCallback(() => {
      const selectedRowData = gridRef.current?.api.getSelectedRows();
      gridRef.current?.api.applyTransaction({ remove: selectedRowData });
    }, []);

    // 제외할 컬럼 ID 배열
    const excludedColumn = ["ag-Grid-SelectionColumn", "evaluation"];

    // colDefs에서 colId와 headerName 매핑  (colDefs 변경 시에만 갱신)
    const headerNameMap = useMemo(() => {
      const map: Record<string, string> = {};
      colDefs.forEach((def) => {
        if (def.field) {
          map[def.field] = def.headerName || def.field;
        }
      });
      return map;
    }, [colDefs]);

    //  ag-Grid의 컬럼 상태(순서 포함)를 가져오는 함수
    const getColumnsState = useCallback(() => {
      if (!gridRef.current?.api)
        return { visibleColumns: [], hiddenColumns: [] };

      // ag-Grid로부터 현재 컬럼 상태 가져오기
      const columnsState = gridRef?.current.api.getColumnState();

      // 표시 컬럼과 표시되지 않는 컬럼으로 분리
      const visibleColumns: ColumnState[] = [];
      const hiddenColumns: ColumnState[] = [];

      columnsState.forEach((state) => {
        const column: ColumnState = {
          colId: state.colId,
          headerName: headerNameMap[state.colId] || state.colId,
          hide: state.hide || false,
        };

        if (excludedColumn.includes(state.colId)) {
          hiddenColumns.push(column);
        } else {
          visibleColumns.push(column);
        }
      });

      return { visibleColumns, hiddenColumns };
    }, [gridRef, headerNameMap]);

    // 개별 컬럼에 대한 표시/숨김 상태를 처리하는 핸들러 함수
    const onColumnVisibility = useCallback(
      (state: { colId: string; hide: boolean }[]) => {
        gridRef.current?.api.applyColumnState({
          state: state,
        });
      },
      []
    );

    // 모든 컬럼에 대한 표시/숨김 상태를 처리하는 핸들러 함수
    const onAllColumnsVisibility = useCallback((hide: boolean) => {
      gridRef.current?.api.applyColumnState({
        defaultState: { hide },
      });
    }, []);

    // 검색 함수
    const onFilterTextChanged = useCallback((text: string) => {
      gridRef.current?.api.setGridOption("quickFilterText", text);
    }, []);

    // 엑셀 다운로드 함수
    const internalExcelDownload = useCallback(() => {
      try {
        if (!gridRef.current?.api) return;

        // 모든 행 데이터 가져오기
        const data: any[] = [];
        gridRef.current.api.forEachNode((node) => {
          if (node.data) {
            data.push(node.data);
          }
        });

        // 엑셀 워크시트 생성
        const worksheet = XLSX.utils.json_to_sheet(data);

        // 컬럼 헤더 이름 설정
        const headers: string[] = [];
        colDefs.forEach((col) => {
          if (col.field) {
            headers.push(col.headerName || col.field);
          }
        });

        // 워크시트에 헤더 정보 추가
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        // 모든 열을 특정 고정 너비로 설정
        const columnWidths = colDefs.map(() => ({ wch: 20 }));
        worksheet["!cols"] = columnWidths;
        // 엑셀 워크북 생성
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "데이터");

        // 현재 날짜와 시간 포맷팅
        const now = new Date();
        const dateStr = now
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "")
          .substring(2);

        // 엑셀 파일 다운로드
        const fileName = `특허 분류 체계_${dateStr}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        console.log("엑셀 파일이 성공적으로 다운로드되었습니다.");
      } catch (error) {
        console.error("엑셀 다운로드 중 오류 발생:", error);
        alert("엑셀 다운로드 중 오류가 발생했습니다.");
      }
    }, [rowData, colDefs]);

    // 다운로드 버튼 클릭 핸들러
    const onExcelDownload = () => {
      // handleExcelDownload props가 있으면 그것을 사용, 없으면 내부 함수 사용
      if (handleExcelDownload) {
        handleExcelDownload();
      } else {
        internalExcelDownload();
      }
    };

    // 데이터 변경 감지 이벤트 처리
    const onCellValueChanged = useCallback(() => {
      if (onDataChanged && gridRef.current?.api) {
        const updatedData: any[] = [];
        gridRef.current.api.forEachNode((node) => {
          if (node.data) {
            updatedData.push(node.data);
          }
        });
        onDataChanged(updatedData);
      }
    }, [onDataChanged]);

    return (
      <div className="flex flex-col h-full font-pretendard w-full mt-2">
        {/* 툴바 영역 */}
        <DataTableToolbar
          fileName={fileName}
          edit={edit}
          download={download}
          onAddNewRow={addNewRow}
          onRemoveSelected={onRemoveSelected}
          onColumnVisibility={onColumnVisibility}
          onAllColumnsVisibility={onAllColumnsVisibility}
          onFilterTextChanged={onFilterTextChanged}
          onExcelDownload={onExcelDownload}
          getColumnsState={getColumnsState}
        />

        {/* 테이블 영역 */}
        <div className="flex-1 relative">
          <AgGridReact
            ref={gridRef} // 내부 그리드 참조 설정
            rowData={rowData} // 행 데이터
            columnDefs={colDefs} // 열 정의
            defaultColDef={defaultColDef} // 기본 열 속성
            autoSizeStrategy={autoSizeStrategy} //열 사이즈 설정
            rowSelection={rowSelection} // 행 선택 옵션
            selectionColumnDef={selectionColumnDef}
            // suppressDragLeaveHidesColumns={true} // 열을 드래그하여 그리드 밖으로 이동시켜도 열이 숨겨지지 않도록 방지
            loading={loading} // 로딩 상태 표시
            onCellValueChanged={onCellValueChanged}
            theme={theme} // 다크 모드 스타일 적용 (다크모드가 아닐 경우 undefined)
          />
        </div>
      </div>
    );
  }
);

export default DataTable;
