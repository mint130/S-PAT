import { useEffect, useRef } from "react";
import ChatGPTIcon from "../../assets/gpt.png";
import ClaudeIcon from "../../assets/claude.png";
import GeminiIcon from "../../assets/gemini.png";
import GrokIcon from "../../assets/grok.png";
import useLLMStore from "../../stores/useLLMStore";

// 디스플레이 이름과 데이터 이름 간의 매핑
const displayToDataNameMap: Record<string, string> = {
  GPT: "GPT",
  Claude: "Claude",
  Gemini: "Gemini",
  Grok: "Grok",
};

// LLM 옵션 인터페이스 정의
interface LLMOption {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
}

const SelectLLM = () => {
  // Zustand 스토어에서 선택된 LLM 상태와 설정 함수 가져오기
  const selectedLLM = useLLMStore((state) => state.selectedLLM);
  const setSelectedLLM = useLLMStore((state) => state.setSelectedLLM);

  const containerRef = useRef<HTMLDivElement>(null);

  // LLM 옵션 목록 - 각 LLM별 색상 클래스 추가
  const llmOptions: LLMOption[] = [
    {
      id: "GPT",
      name: "GPT",
      icon: ChatGPTIcon,
      colorClass: "text-GPT",
    },
    {
      id: "Claude",
      name: "Claude",
      icon: ClaudeIcon,
      colorClass: "text-Claude",
    },
    {
      id: "Gemini",
      name: "Gemini",
      icon: GeminiIcon,
      colorClass: "text-Gemini",
    },
    {
      id: "Grok",
      name: "Grok",
      icon: GrokIcon,
      colorClass: "text-Grok",
    },
  ];

  // LLM 선택 핸들러 - 같은 버튼을 다시 누르면 선택 해제
  const handleSelectLLM = (displayName: string) => {
    const dataName = displayToDataNameMap[displayName];

    if (selectedLLM === dataName) {
      setSelectedLLM(null); // 같은 버튼 클릭 시 선택 해제
    } else {
      setSelectedLLM(dataName);
    }
  };

  // 컴포넌트 외부 클릭 시 선택 해제 이벤트 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedLLM(null);
      }
    };

    // 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedLLM]);

  return (
    <div className="py-2" ref={containerRef}>
      <div className="flex space-x-2">
        {llmOptions.map((llm) => {
          // 현재 옵션이 선택되었는지 확인 (데이터 이름 기준)
          const isSelected = selectedLLM === displayToDataNameMap[llm.id];

          return (
            <button
              key={llm.id}
              onClick={() => handleSelectLLM(llm.id)}
              className={`flex items-center justify-center w-28 px-3 py-2 rounded-md transition-all ${
                llm.colorClass
              } ${
                isSelected
                  ? `bg-select-box font-medium border border-select-box-border-soild`
                  : "border border-gray-300"
              }`}>
              <img
                src={llm.icon}
                alt={`${llm.name} 아이콘`}
                className="w-5 h-5 mr-2"
              />
              <span>{llm.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectLLM;
