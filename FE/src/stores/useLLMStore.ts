import { create } from "zustand";
import { persist } from "zustand/middleware";

// LLM 항목 타입 정의
interface LLMItem {
  name: string;
  time: number;
  vector_accuracy: number;
  reasoning_score: number;
  expert: number;
}

// 응답 데이터 타입 정의 (sample 필드는 선택적)
interface ResponseDataItem {
  name: string;
  time?: number;
  vector_accuracy?: number;
  reasoning_score?: number;
  expert?: number;
}

// 스토어 상태 타입 정의
interface LLMStoreState {
  llmData: LLMItem[];
  setLLMData: (data: LLMItem[]) => void;
  updateLLM: (name: string, data: Partial<LLMItem>) => void;
  initializeFromResponse: (responseData: ResponseDataItem[]) => void;
  // 선택된 LLM을 추적하는 상태 추가
  selectedLLM: string | null;
  // 선택된 LLM을 설정하는 액션 추가
  setSelectedLLM: (llm: string | null) => void;
  // 스킵 상태 추가
  expertEvaluationSkipped: boolean;
  // 전문가 평가 스킵 여부 상태 추가
  setExpertEvaluationSkipped: (skipped: boolean) => void;
}

// 초기 데이터
const initialLLMData: LLMItem[] = [
  {
    name: "GPT",
    time: 720, // 속도 (초)
    vector_accuracy: 0.85, // 유사도 (0-1)
    reasoning_score: 0.92, // LLM 평가 (0-1)
    expert: 0.9, // 전문가 평가 (0-1)
  },
  {
    name: "CLAUDE",
    time: 654,
    vector_accuracy: 0.85,
    reasoning_score: 0.85,
    expert: 0.8, // 전문가 평가 (0-1)
  },
  {
    name: "GEMINI",
    time: 684,
    vector_accuracy: 0.75,
    reasoning_score: 0.9,
    expert: 0.6, // 전문가 평가 (0-1)
  },
  {
    name: "GROK",
    time: 986,
    vector_accuracy: 0.8,
    reasoning_score: 0.92,
    expert: 0.8, // 전문가 평가 (0-1)
  },
];

// LLM 데이터를 위한 Zustand 스토어 (persist 적용)
const useLLMStore = create<LLMStoreState>()(
  persist(
    (set) => ({
      // 초기 상태 (디폴트 값)
      llmData: initialLLMData,

      // 초기값은 null (아무것도 선택되지 않음)
      selectedLLM: "GPT",

      // 스킵 상태 초기값 (기본적으로 스킵하지 않음)
      expertEvaluationSkipped: false,

      // 선택된 LLM을 설정하는 액션
      setSelectedLLM: (llm) => set({ selectedLLM: llm }),

      // LLM 데이터 설정 액션
      setLLMData: (data: LLMItem[]) => set({ llmData: data }),

      // 특정 LLM 데이터 업데이트 액션
      updateLLM: (name: string, data: Partial<LLMItem>) =>
        set((state) => ({
          llmData: state.llmData.map((llm) =>
            llm.name === name ? { ...llm, ...data } : llm
          ),
        })),

      // 이전 단계에서 받은 데이터로 스토어 초기화
      initializeFromResponse: (responseData: ResponseDataItem[]) => {
        if (!Array.isArray(responseData)) return;

        const updatedData = responseData.map((item) => ({
          name: item.name,
          time: item.time || 0,
          vector_accuracy: item.vector_accuracy || 0,
          reasoning_score: item.reasoning_score || 0,
          expert: item.expert || 0,
        }));

        set({ llmData: updatedData });
      },

      setExpertEvaluationSkipped: (skipped) =>
        set({
          expertEvaluationSkipped: skipped,
        }),
    }),
    {
      name: "llm-store", // 로컬스토리지에 저장될 키 이름
      // 선택적: 특정 필드만 저장하고 싶다면
      partialize: (state) => ({
        llmData: state.llmData,
        expertEvaluationSkipped: state.expertEvaluationSkipped,
      }),
    }
  )
);

export default useLLMStore;
