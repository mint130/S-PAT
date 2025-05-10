import { create } from "zustand";

// LLM 항목 타입 정의
interface LLMItem {
  name: string;
  time: number;
  similarity: number;
  llmEval: number;
  expert: number;
}

// 응답 데이터 타입 정의 (sample 필드는 선택적)
interface ResponseDataItem {
  name: string;
  time?: number;
  similarity?: number;
  llmEval?: number;
  expert?: number;
}

// 스토어 상태 타입 정의
interface LLMStoreState {
  llmData: LLMItem[];
  setLLMData: (data: LLMItem[]) => void;
  updateLLM: (name: string, data: Partial<LLMItem>) => void;
  initializeFromResponse: (responseData: ResponseDataItem[]) => void;
}

// LLM 데이터를 위한 Zustand 스토어
const useLLMStore = create<LLMStoreState>((set) => ({
  // 초기 상태 (디폴트 값)
  llmData: [
    {
      name: "Gpt",
      time: 2.3, // 속도 (초)
      similarity: 0.85, // 유사도 (0-1)
      llmEval: 0.92, // LLM 평가 (0-1)
      expert: 0.9, // 전문가 평가 (0-1)
    },
    {
      name: "Claude",
      time: 2.3,
      similarity: 0.85,
      llmEval: 0.85,
      expert: 0.8, // 전문가 평가 (0-1)
    },
    {
      name: "Gemini",
      time: 2.3,
      similarity: 0.75,
      llmEval: 0.9,
      expert: 0.6, // 전문가 평가 (0-1)
    },
    {
      name: "Grok",
      time: 2.3,
      similarity: 0.8,
      llmEval: 0.92,
      expert: 0.8, // 전문가 평가 (0-1)
    },
  ],

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
      similarity: item.similarity || 0,
      llmEval: item.llmEval || 0,
      expert: item.expert || 0,
    }));

    set({ llmData: updatedData });
  },
}));

export default useLLMStore;
