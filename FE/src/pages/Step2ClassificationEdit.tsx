import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../components/common/Title";
import DataTable from "../components/common/dataTable/DataTable";
import Button from "../components/common/Button";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import NextModal from "../components/common/NextModal";
import WarningModal from "../components/common/WarningModal";

const CLASSIFICATION_COLUMNS: ColDef[] = [
  {
    headerName: "분류코드",
    field: "code",
  },
  {
    headerName: "분류단계",
    field: "level",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["대분류", "중분류", "소분류"],
    },
  },
  {
    headerName: "명칭",
    field: "name",
  },
  {
    headerName: "상세 설명",
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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [warningModalOpen, setWarningModalOpen] = useState<boolean>(false);

  const { selectedStandards } = location.state || [];
  const [colDefs] = useState<ColDef[]>(CLASSIFICATION_COLUMNS);
  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    if (!selectedStandards) {
      const Role = localStorage.getItem("role");

      if (Role == "User") {
        navigate("/user/step2");
      } else {
        navigate("/admin/step2");
      }
      return;
    }
  }, [selectedStandards, navigate]);

  useEffect(() => {
    setWarningModalOpen(true);
  }, []);

  const handleWarningModalConfirm = () => {
    setWarningModalOpen(false);
  };

  if (!selectedStandards) {
    return null;
  }

  const handleNext = async () => {
    setModalOpen(true);
  };

  const onCancel = () => {
    setModalOpen(false);
  };

  const onConfirm = async () => {
    setLoading(true);

    try {
      const sessionId = localStorage.getItem("sessionId");

      if (!sessionId) {
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
        `https://s-pat.site/api/user/${sessionId}/standard/save`,
        {
          standards: updatedStandards,
        }
      );

      console.log("step2 데이터:", updatedStandards);
      console.log("step2 응답 데이터:", response.data);

      // 성공적으로 처리된 후 다음 단계로 이동
      const Role = localStorage.getItem("role");

      if (Role == "User") {
        // state와 함께 Step2로 네비게이션
        navigate("/user/step3");
      } else {
        navigate("/admin/step3");
      }
    } catch (err) {
      console.error("step2 API 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-8 py-5">
      <Title
        text="분류 체계 수정"
        subText="Step1에서 생성된 분류 체계를 수정하세요. 테이블을 직접 편집하거나 필요에 따라 항목을 추가/삭제할 수 있습니다."
      />

      <div className="flex-1 h-full w-full mt-2">
        <DataTable
          rowData={selectedStandards}
          colDefs={colDefs}
          edit={true}
          download={true}
          ref={gridRef}
        />
      </div>

      <div className="flex justify-end w-full mt-7">
        <Button variant="primary" size="md" onClick={handleNext}>
          다음
        </Button>
      </div>

      <NextModal
        isOpen={modalOpen}
        title="해당 특허분류 체계로 진행하시겠습니까?"
        description="진행하기 버튼을 누르면 수정이 불가합니다."
        onCancel={onCancel}
        onConfirm={onConfirm}
        isLoading={loading}
      />

      <WarningModal
        isOpen={warningModalOpen}
        onConfirm={handleWarningModalConfirm}
      />
    </div>
  );
}

export default Step2ClassificationEdit;
