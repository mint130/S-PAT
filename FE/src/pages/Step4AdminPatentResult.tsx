import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../components/common/Title";
import Button from "../components/common/Button";
import SelectLLM from "../components/common/SelectLLM";
import DataTable from "../components/dataTable/DataTable";
import ExpertSkip from "../components/Step4_Admin/ExpertSkip";
import NextModal from "../components/common/NextModal";
import { patentColumns } from "../components/Step4_Admin/patentColums";
import useLLMStore from "../stores/useLLMStore";

// API 응답 데이터 타입
interface ApiResponse {
  sampling_info: {
    total_patents: number;
    sample_size: number;
    confidence_level: number;
    margin_error: number;
    indices: number[];
  };
  results: {
    name: string;
    time: string;
    vector_accuracy: number;
    reasoning_score: number;
    patents: {
      applicationNumber: string;
      title: string;
      abstract: string;
      majorCode: string;
      middleCode: string;
      smallCode: string;
      majorTitle: string;
      middleTitle: string;
      smallTitle: string;
    }[];
  }[];
}

// 특허 데이터에 LLM별 정보와 평가 필드 추가
interface PatentDataWithEvaluation {
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
  llmSource?: string;
  originalIndex?: number;
}

// API 응답 데이터를 파싱하고 LLM별로 데이터 가져오기
const parseApiResponse = (apiData: ApiResponse) => {
  const llmDataMap = new Map<string, PatentDataWithEvaluation[]>();

  apiData.results.forEach((result) => {
    const llmName = result.name;
    const patents = result.patents.map((patent, index) => ({
      ...patent,
      llmSource: llmName,
      originalIndex: index,
      evaluation: undefined,
    }));

    llmDataMap.set(llmName, patents);
  });

  return llmDataMap;
};

// 선택된 LLM의 특허 데이터 가져오기
const getPatentsByLLM = (
  llmDataMap: Map<string, PatentDataWithEvaluation[]>,
  selectedLLM: string | null
): PatentDataWithEvaluation[] => {
  if (!selectedLLM) return [];
  const key = selectedLLM;
  return llmDataMap.get(key) || [];
};

// LLM별 평가 점수 계산 (평균)
const calculateLLMExpertScore = (
  patents: PatentDataWithEvaluation[]
): number => {
  const evaluatedPatents = patents.filter(
    (p) => p.evaluation !== undefined && p.evaluation !== null
  );
  if (evaluatedPatents.length === 0) return 0;

  const totalScore = evaluatedPatents.reduce(
    (sum, patent) => sum + (patent.evaluation || 0),
    0
  );
  return (totalScore / evaluatedPatents.length) * 100;
};

function Step4AdminPatentResult() {
  const apiUrl = import.meta.env.VITE_API_URL as string;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { llmData, updateLLM, selectedLLM } = useLLMStore();
  const [columnDefs] = useState(patentColumns);
  const [evaluatedCount, setEvaluatedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // LLM별 데이터 저장
  const [llmPatentData, setLlmPatentData] = useState<
    Map<string, PatentDataWithEvaluation[]>
  >(new Map());

  // 현재 선택된 LLM의 특허 데이터
  const currentPatents = useMemo(() => {
    return getPatentsByLLM(llmPatentData, selectedLLM);
  }, [llmPatentData, selectedLLM]);

  // 세션 ID 가져오기 (실제로는 전역 상태나 context에서 관리)
  const sessionId = localStorage.getItem("sessionId");

  // API에서 분류 샘플링 데이터 가져오기
  const fetchClassificationData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse>(
        `${apiUrl}/api/admin/${sessionId}/classification/sampling`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const parsedData = parseApiResponse(response.data);
      setLlmPatentData(parsedData);

      // LLM 스토어 업데이트 (시간, 유사도, LLM평가 점수)
      response.data.results.forEach((result) => {
        const llmName = result.name;

        updateLLM(llmName, {
          time: parseFloat(result.time),
          vector_accuracy: result.vector_accuracy / 100,
          reasoning_score: result.reasoning_score / 100,
        });
      });

      console.log("업데이트 후 스토어 상태:", useLLMStore.getState().llmData);
    } catch (error) {
      console.error("분류 데이터 가져오기 실패:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "데이터를 가져오는데 실패했습니다."
        );
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchClassificationData();
  }, []);

  // 평가 카운트 업데이트
  useEffect(() => {
    if (currentPatents.length > 0) {
      const count = currentPatents.filter(
        (item) => item.evaluation !== null && item.evaluation !== undefined
      ).length;
      setEvaluatedCount(count);
    } else {
      setEvaluatedCount(0);
    }
  }, [currentPatents, llmPatentData, selectedLLM]);

  // 전문가 평가 처리 함수
  const handleDataChanged = useCallback(
    (updatedData: PatentDataWithEvaluation[]) => {
      if (!selectedLLM) return;

      // 현재 LLM의 데이터 업데이트
      const newMap = new Map(llmPatentData);
      newMap.set(selectedLLM.toLowerCase(), updatedData);
      setLlmPatentData(newMap);

      // 평균 평가 점수 계산 및 스토어 업데이트
      const expertScore = calculateLLMExpertScore(updatedData);
      updateLLM(selectedLLM, { expert: expertScore / 100 });
    },
    [selectedLLM, llmPatentData, updateLLM]
  );

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
    // 모든 LLM의 expert 평가 점수를 0으로 설정
    llmData.forEach((llm) => {
      updateLLM(llm.name, { expert: 0 });
    });

    // 스킵 상태를 true로 설정
    useLLMStore.getState().setExpertEvaluationSkipped(true);

    setIsModalOpen(false);
    navigate("/admin/step5");
  };

  // 모든 LLM의 평가가 완료되었는지 확인
  const checkAllLLMsEvaluated = useCallback(() => {
    const llmNames = ["GPT", "CLAUDE", "GEMINI", "GROK"];
    return llmNames.every((llmName) => {
      const patents = llmPatentData.get(llmName) || [];
      return patents.every(
        (patent) =>
          patent.evaluation !== null && patent.evaluation !== undefined
      );
    });
  }, [llmPatentData]);

  // 다음 버튼 클릭 핸들러
  const handleNextClick = () => {
    useLLMStore.getState().setExpertEvaluationSkipped(false);
    navigate("/admin/step5");
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full p-8 pb-6">
        <Title
          text="특허데이터 분류 결과 확인 및 전문가 평가"
          subText="4개 LLM 모델의 분류 결과 샘플을 확인하고, 각 행에 전문가 평가를 진행할 수 있습니다. 건너뛰기 시 전문가평가는 생략됩니다. (전문가평가: 0 틀림 / 0.5 보완 / 1 정확)"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 에러가 발생했을 때
  if (error) {
    return (
      <div className="flex flex-col h-full w-full p-8 pb-6">
        <Title
          text="특허데이터 분류 결과 확인 및 전문가 평가"
          subText="4개 LLM 모델의 분류 결과 샘플을 확인하고, 각 행에 전문가 평가를 진행할 수 있습니다. 건너뛰기 시 전문가평가는 생략됩니다. (전문가평가: 0 틀림 / 0.5 보완 / 1 정확)"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <Button
              variant="primary"
              size="md"
              onClick={() => fetchClassificationData()}>
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-8 pb-6">
      <Title
        text="특허데이터 분류 결과 확인 및 전문가 평가"
        subText="4개 LLM 모델의 분류 결과 샘플을 확인하고, 각 행에 전문가 평가를 진행할 수 있습니다. 건너뛰기 시 전문가평가는 생략됩니다. (전문가평가: 0 틀림 / 0.5 보완 / 1 정확)"
      />

      <DataTable
        rowData={currentPatents}
        colDefs={columnDefs}
        onDataChanged={handleDataChanged}
        fileName={<SelectLLM />}
      />

      {/* 평가 카운트 표시 */}
      <div className="flex items-between justify-between w-full ">
        <div className="text-gray-400 text-sm mt-1">
          신뢰도 95%, 오차범위 ±5% 전체 데이터 중 일부를 추출하였습니다.
        </div>
        {selectedLLM && (
          <div className="text-sm text-gray-500 mt-1">
            총 {currentPatents.length}건 중 {evaluatedCount}건 평가 완료
          </div>
        )}
      </div>

      <div className="flex justify-end w-full mt-4">
        <div className="flex items-center space-x-6">
          <ExpertSkip onSkipClick={handleSkipClick} />
          <Button
            variant="primary"
            size="md"
            className="w-24"
            disabled={!checkAllLLMsEvaluated()}
            onClick={handleNextClick}>
            다음
          </Button>
        </div>
      </div>

      <NextModal
        isOpen={isModalOpen}
        title="전문가 평가를 그만하시겠습니까?"
        description="각 LLM에 대한 전문가 평가가 생략됩니다."
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default Step4AdminPatentResult;
