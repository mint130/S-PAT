import { useState } from "react";
import Title from "../components/common/Title";
import Button from "../components/common/Button";
import SelectLLM from "../components/common/SelectLLM";
import DataTable from "../components/common/dataTable/DataTable";
import ExpertSkip from "../components/Step4_Admin/ExpertSkip";
import NextModal from "../components/common/NextModal";

import { useNavigate } from "react-router-dom";
import useLLMStore from "../stores/useLLMStore";

function Step4AdminPatentResult() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { llmData, updateLLM } = useLLMStore();

  // 건너뛰기 버튼 클릭 핸들러
  const handleSkipClick = () => {
    setIsModalOpen(true);
  };

  // 모달 취소 핸들러
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 모달 확인 핸들러
  const handleConfirm = () => {
    // 모든 LLM의 expert 점수를 1로 업데이트
    llmData.forEach((llm) => {
      updateLLM(llm.name, { expert: 1 });
    });

    setIsModalOpen(false);

    // 성공 메시지나 다음 단계로 이동 로직 추가
    console.log("모든 LLM의 전문가 평가가 100점으로 설정되었습니다.");
    navigate("/admin/step5");
  };

  return (
    <div className="flex flex-col min-h-screen w-full p-8 pb-6">
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
            navigate("/admin/step3");
          }}>
          이전
        </Button>
        <div className="flex items-center space-x-6">
          <ExpertSkip onSkipClick={handleSkipClick} />
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

      {/* 모달을 최상위 레벨로 이동 */}
      <NextModal
        isOpen={isModalOpen}
        title="전문가 평가를 그만하시겠습니까?"
        description="각 LLM에 대한 전문가 평가가 모두 100점으로 저장됩니다."
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default Step4AdminPatentResult;
