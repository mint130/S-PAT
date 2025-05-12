import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../components/common/Title";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

const CLASSIFICATION_COLUMNS: ColDef[] = [
  {
    headerName: "코드",
    field: "code",
  },
  {
    headerName: "분류",
    field: "level",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["대분류", "중분류", "소분류"],
    },
  },
  {
    headerName: "이름",
    field: "name",
  },
  {
    headerName: "설명",
    field: "description",
    cellEditor: "agLargeTextCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      rows: 4,
      cols: 50,
    },
  },
];

function Step2ClassificationEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const { selectedStandards } = location.state || [];
  const [colDefs] = useState<ColDef[]>(CLASSIFICATION_COLUMNS);
  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    if (!selectedStandards) {
      navigate("/user/step1");
      return;
    }
  }, [selectedStandards, navigate]);

  const handlePrevious = () => {
    navigate("/user/step1");
  };

  const handleNext = async () => {
    setLoading(true);

    try {
      const session_id = localStorage.getItem("sessionId"); // 로컬스토리지에서 세션 ID 가져오기

      if (!session_id) {
        throw new Error("세션 ID를 찾을 수 없습니다.");
      }

      // 편집 중인 셀이 있다면 편집 종료
      gridRef.current?.api.stopEditing();

      // 모든 행 데이터 가져오기
      const updatedStandards: any[] = [];
      gridRef.current?.api.forEachNode((node) => {
        updatedStandards.push(node.data);
      });
      console.log(updatedStandards);

      const response = await axios.post(
        `https://s-pat.site/api/test/${session_id}/standard/save`,
        {
          standards: updatedStandards,
        }
      );

      console.log("step2 응답 데이터:", response.data);

      // 성공적으로 처리된 후 다음 단계로 이동
      navigate("/user/step3");
    } catch (err) {
      console.error("step2 API 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedStandards) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full px-8 py-5">
      <Title
        text="분류 체계 수정"
        subText="Step1에서 생성된 분류 체계를 수정하세요. 테이블을 직접 편집하거나 필요에 따라 항목을 추가/삭제할 수 있습니다."
      />

      <div className="flex-1 h-full w-full mt-2 ">
        <DataTable
          rowData={selectedStandards}
          colDefs={colDefs}
          edit={true}
          gridRef={gridRef}
        />
      </div>

      <div className="flex justify-between w-full mt-7">
        <Button
          variant="outline"
          size="md"
          onClick={handlePrevious}
          disabled={loading}>
          이전
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleNext}
          isLoading={loading}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default Step2ClassificationEdit;
