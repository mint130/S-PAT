import SelectLLM from "../components/common/SelectLLM";
import Title from "../components/common/Title";

function Step5AdminModelComparison() {
  return (
    <div className="flex flex-col h-screen p-8 pb-6">
      <Title
        text="LLM 성능 비교 및 최적 모델 선정"
        subText="LLM 별 평가점수를 확인하고 최적의 LLM 모델을 선정하세요."
      />
      <SelectLLM />
    </div>
  );
}

export default Step5AdminModelComparison;
