import Title from "../components/common/Title";
import Button from "../components/common/Button";
import SelectLLM from "../components/common/SelectLLM";
import DataTable from "../components/common/DataTable";

import { useNavigate } from "react-router-dom";

function Step4AdminPatentResult() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen p-8 pb-6">
      <Title
        text="특허데이터 분류 결과 확인"
        subText="4개 LLM 모델의 분류 결과 샘플을 확인하고, 각 행에 전문가 평가를 진행할 수 있습니다. 생략 시 성능 비교에 반영되지 않습니다."
      />
      <SelectLLM />
      <div className="flex-grow">
        <DataTable rowData={[]} colDefs={[]} />
      </div>

      <div className="flex justify-between w-full mt-4">
        <Button
          variant="outline"
          size="md"
          className="w-24"
          onClick={() => {
            alert("이전 단계로 이동합니다.");
          }}>
          이전
        </Button>
        <Button
          variant="primary"
          size="md"
          className="w-24"
          onClick={() => {
            navigate("/admin/step5");
          }}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default Step4AdminPatentResult;
