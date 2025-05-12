import Button from "../components/common/Button";
import SelectLLM from "../components/common/SelectLLM";
import Title from "../components/common/Title";
import LLMBarChart from "../components/Step5_admin/LLMBarChart";
import ResponseTime from "../components/Step5_admin/ResponseTime";
import TotalScore from "../components/Step5_admin/TotalScore";

import useLLMStore from "../stores/useLLMStore";

function Step5AdminModelComparison() {
  const selectedLLM = useLLMStore((state) => state.selectedLLM);

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
      {/* 제목과 LLM 선택 영역 */}
      <Title
        text="LLM 성능 비교 및 최적 모델 선정"
        subText="LLM 별 평가점수를 확인하고 최적의 LLM 모델을 선정하세요."
      />
      <SelectLLM />

      {/* 컨텐츠 영역 - flex 컨테이너로 변경 */}
      <div
        className="flex flex-col flex-grow mt-1 w-full"
        style={{ minHeight: "calc(100vh - 300px)" }}>
        <div
          className="grid grid-cols-3 gap-6 w-full flex-grow-2"
          style={{ flex: "1" }}>
          {/* 유사도 차트 */}
          <LLMBarChart
            title="벡터 유사도"
            dataKey="similarity"
            color="#5A6ACF"
            barSize={16}
          />

          {/* LLM 평가 차트 */}
          <LLMBarChart
            title="LLM 평가"
            dataKey="llmEval"
            color="#5A6ACF"
            barSize={16}
          />

          {/* 전문가 평가 차트 */}
          <LLMBarChart
            title="전문가 평가"
            dataKey="expert"
            color="#5A6ACF"
            barSize={16}
          />
        </div>

        <div
          className="grid grid-cols-2 gap-6 w-full flex-grow-3 mt-2"
          style={{ flex: "10" }}>
          <ResponseTime />
          <TotalScore />
        </div>
      </div>

      {/* 이전/다음 버튼 영역 */}
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
            alert(`${selectedLLM} 이 선택되었습니다.`);
          }}>
          완료
        </Button>
      </div>
    </div>
  );
}

export default Step5AdminModelComparison;
