import { useState } from "react";
import { useLocation } from "react-router-dom";
import Title from "../components/common/Title";
import patentColumnsStep4 from "../components/Step4/patentColumsStep4";
import DataTable from "../components/common/dataTable/DataTable";

function Step4PatentResult() {
  const location = useLocation();
  const [colDefs] = useState(patentColumnsStep4);

  const { patentResult } = location.state || [];

  return (
    <div className="flex flex-col h-full p-8">
      <Title
        text="특허 데이터 분류 결과"
        subText="특허 분류 체계를 기준으로 설정된 최적 LLM 모델을 통해 특허 데이터 분류 결과를 확인하실 수 있습니다"
      />

      <DataTable rowData={patentResult} colDefs={colDefs} download={true} />
    </div>
  );
}

export default Step4PatentResult;
