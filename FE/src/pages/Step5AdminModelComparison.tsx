import SelectLLM from "../components/common/SelectLLM";
import Title from "../components/common/Title";
import LLMBarChart from "../components/Step5_admin/LLMBarChart";

function Step5AdminModelComparison() {
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
      <Title
        text="LLM 성능 비교 및 최적 모델 선정"
        subText="LLM 별 평가점수를 확인하고 최적의 LLM 모델을 선정하세요."
      />
      <SelectLLM />

      {/* 반응형 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4 w-full">
        {/* 유사도 차트 */}
        <LLMBarChart
          title="벡터 유사도"
          dataKey="similarity"
          color="#5A6ACF"
          barSize={20}
        />

        {/* LLM 평가 차트 */}
        <LLMBarChart
          title="LLM 평가"
          dataKey="llmEval"
          color="#5A6ACF"
          barSize={20}
        />

        {/* 전문가 평가 차트 */}
        <LLMBarChart
          title="전문가 평가"
          dataKey="expert"
          color="#5A6ACF"
          barSize={20}
        />
      </div>
    </div>
  );
}

export default Step5AdminModelComparison;
