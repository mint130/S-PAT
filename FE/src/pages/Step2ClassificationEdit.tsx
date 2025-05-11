import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../components/common/Title";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import type { ColDef } from "ag-grid-community";

function Step2ClassificationEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [colDefs] = useState<ColDef<any, any>[]>([
    {
      headerName: "코드",
      field: "code",
    },
    {
      headerName: "분류",
      field: "level",
    },
    {
      headerName: "이름",
      field: "name",
    },
    {
      headerName: "설명",
      field: "description",
    },
  ]);

  const { selectedStandards } = location.state || {};

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

      const response = await axios.post(
        `https://s-pat.site/api/user/${session_id}/standard/save`,
        { standards: selectedStandards }
      );

      console.log("API 응답:", response.data);

      // 성공적으로 처리된 후 다음 단계로 이동
      navigate("/user/step3");
    } catch (err) {
      console.error("API 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedStandards) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen p-8 pb-6">
      <Title
        text="분류 체계 수정"
        subText="Step1에서 생성된 분류 체계를 수정하세요. 테이블을 직접 편집하거나 필요에 따라 항목을 추가/삭제할 수 있습니다."
      />

      <DataTable rowData={selectedStandards} colDefs={colDefs} />

      {/* 이전/다음 버튼 영역 */}
      <div className="flex justify-between w-full mt-10">
        <Button
          variant="outline"
          size="md"
          className="w-24"
          onClick={handlePrevious}
          disabled={loading}>
          이전
        </Button>
        <Button
          variant="primary"
          size="md"
          className="w-24"
          onClick={handleNext}
          isLoading={loading}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default Step2ClassificationEdit;
