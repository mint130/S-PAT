import { useState, useCallback } from "react";
import Title from "../components/common/Title";
import Button from "../components/common/Button";
import SelectLLM from "../components/common/SelectLLM";
import DataTable from "../components/common/dataTable/DataTable";
import ExpertSkip from "../components/Step4_Admin/ExpertSkip";
import NextModal from "../components/common/NextModal";
import { patentColumns } from "../components/Step4_Admin/patentColums";

import { useNavigate } from "react-router-dom";
import useLLMStore from "../stores/useLLMStore";
interface PatentData {
  applicationNumber: string;
  title: string;
  abstract: string;
  majorCode: string;
  middleCode: string;
  smallCode: string;
  majorTitle: string;
  middleTitle: string;
  smallTitle: string;
  evaluation?: number;
}

const mockPatentData = [
  {
    applicationNumber: "KR10-2023-0045678",
    title: "자연어처리모델을 이용한 특허 분석 시스템",
    abstract:
      "본 발명은 인공지능 기반 자연어처리모델을 활용하여 특허 문서를 자동으로 분석하고 유사도를 측정하는 시스템에 관한 것이다. 본 발명은 특허 문서의 청구항, 명세서, 요약 등을 분석하여 기술 분야별 분류 및 유사 특허 검색 기능을 제공한다.",
    majorCode: "H04",
    middleCode: "H04-01",
    smallCode: "H04-01-01",
    majorTitle: "인터페이스 및 인지 AI",
    middleTitle: "음성 인식 인터페이스",
    smallTitle: "경량화 음성 모델",
  },
  {
    applicationNumber: "KR10-2023-0067890",
    title: "블록체인 기반 지식재산권 관리 시스템",
    abstract:
      "본 발명은 블록체인 기술을 활용하여 지식재산권의 등록, 거래, 라이센싱을 안전하게 관리하는 시스템에 관한 것이다. 본 발명은 위변조가 불가능한 분산원장을 통해 특허, 상표, 저작권 등의 지식재산권에 대한 소유권 및 이력을 투명하게 관리할 수 있다.",
    majorCode: "G06",
    middleCode: "G06-05",
    smallCode: "G06-05-03",
    majorTitle: "분산 컴퓨팅 및 블록체인",
    middleTitle: "분산원장기술",
    smallTitle: "스마트 계약",
  },
  {
    applicationNumber: "KR10-2023-0089012",
    title: "웨어러블 디바이스를 이용한 건강 모니터링 시스템",
    abstract:
      "본 발명은 웨어러블 디바이스로부터 수집된 생체신호를 분석하여 사용자의 건강 상태를 실시간으로 모니터링하는 시스템에 관한 것이다. 본 발명은 심박수, 혈압, 체온 등의 데이터를 AI 알고리즘으로 분석하여, 이상 징후를 조기에 감지하고 맞춤형 건강 관리 솔루션을 제공한다.",
    majorCode: "A61",
    middleCode: "A61-B5",
    smallCode: "A61-B5-00",
    majorTitle: "의료기기",
    middleTitle: "진단 및 측정",
    smallTitle: "생체신호 측정",
  },
];

function Step4AdminPatentResult() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { llmData, updateLLM } = useLLMStore();
  const [columnDefs] = useState(patentColumns);
  const [evaluatedCount, setEvaluatedCount] = useState(0);
  const [isAllEvaluated, setIsAllEvaluated] = useState(false);
  const [rowData, setRowtData] = useState<PatentData[]>(mockPatentData);

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

  // 전문가 평가 처리 함수
  const handleDataChanged = useCallback((updatedData: PatentData[]) => {
    console.log("데이터가 변경되었습니다:", updatedData);
    const count = updatedData.filter(
      (item) => item.evaluation !== null && item.evaluation !== undefined
    ).length;
    setEvaluatedCount(count); // 평가된 항목 수
    setIsAllEvaluated(count === updatedData.length); // 평가 완료 여부
    setRowtData(updatedData); // 변경된 데이터 동기화
  }, []);

  // 다음 버튼 클릭 핸들러
  const handleNextClick = () => {
    // 총점 계산
    const totalScore = rowData.reduce(
      (acc, item) => acc + (item.evaluation || 0),
      0
    );
    console.log("총점", totalScore);

    // 다음 페이지로 이동
    navigate("/admin/step5");
  };

  return (
    <div className="flex flex-col h-full w-full p-8 pb-6">
      <Title
        text="특허데이터 분류 결과 확인"
        subText="4개 LLM 모델의 분류 결과 샘플을 확인하고, 각 행에 전문가 평가를 진행할 수 있습니다. 생략 시 성능 비교에 반영되지 않습니다."
      />
      {/* <SelectLLM /> */}

      <div className="flex-1 h-full w-full mt-2">
        <DataTable
          rowData={rowData}
          colDefs={columnDefs}
          download={true}
          onDataChanged={handleDataChanged}
          fileName={<SelectLLM />}
        />
      </div>

      {/* 평가 카운트 표시 */}
      <div className="text-right text-sm text-gray-500 mt-1">
        총 {rowData.length}건 중 {evaluatedCount}건 평가 완료
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
            disabled={!isAllEvaluated} // 모든 항목이 평가되지 않았으면 비활성화
            onClick={handleNextClick}>
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
