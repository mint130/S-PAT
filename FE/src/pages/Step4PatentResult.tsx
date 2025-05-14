import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/common/Title";
import DataTable from "../components/common/dataTable/DataTable";
import Button from "../components/common/Button";
import type { ColDef } from "ag-grid-community";

function Step4PatentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [colDefs] = useState<ColDef<any, any>[]>([
    {
      headerName: "출원 번호",
      field: "applicationNumber",
    },
    {
      headerName: "명칭",
      field: "title",
    },
    {
      headerName: "요약",
      field: "abstract",
    },
    {
      headerName: "대분류 코드",
      field: "majorCode",
    },
    {
      headerName: "중분류 코드",
      field: "middleCode",
    },
    {
      headerName: "소분류 코드",
      field: "smallCode",
    },
    {
      headerName: "대분류 명칭",
      field: "majorTitle",
    },
    {
      headerName: "중분류 명칭",
      field: "middleTitle",
    },
    {
      headerName: "소분류 명칭",
      field: "smallTitle",
    },
  ]);

  const { patentResult } = location.state || [];
  const handlePrevious = () => {
    navigate("/user/step3");
  };

  return (
    <div className="flex flex-col h-screen p-8 pb-6">
      <Title text="특허 데이터분류 결과" subText="" />

      <DataTable rowData={patentResult} colDefs={colDefs} />

      {/* 이전/다음 버튼 영역 */}
      <div className="flex justify-between w-full mt-10">
        <Button
          variant="outline"
          size="md"
          className="w-24"
          onClick={handlePrevious}>
          이전
        </Button>
        <Button variant="primary" size="md" className="w-24">
          종료
        </Button>
      </div>
    </div>
  );
}

export default Step4PatentResult;
