import { useState, useEffect, useRef } from "react";
import ChatGPTIcon from "../../assets/gpt.png";
import ClaudeIcon from "../../assets/claude.png";
import GeminiIcon from "../../assets/gemini.png";
import GrokIcon from "../../assets/grok.png";

// LLM 타입 정의 (null 추가)
type LLMType = "ChatGPT" | "Claude" | "Gemini" | "Grok" | null;

// LLM 옵션 인터페이스 정의
interface LLMOption {
  id: LLMType;
  name: string;
  icon: string;
  colorClass: string;
}

const SelectLLM = () => {
  const [selectedLLM, setSelectedLLM] = useState<LLMType>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // LLM 옵션 목록 - 각 LLM별 색상 클래스 추가
  const llmOptions: LLMOption[] = [
    {
      id: "ChatGPT",
      name: "Chat GPT",
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
    { id: "Grok", name: "Grok", icon: GrokIcon, colorClass: "text-Grok" },
  ];

  // LLM 선택 핸들러 - 같은 버튼을 다시 누르면 선택 해제
  const handleSelectLLM = (llmId: LLMType) => {
    if (selectedLLM === llmId) {
      setSelectedLLM(null); // 같은 버튼 클릭 시 선택 해제
    } else {
      setSelectedLLM(llmId);
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
  }, []);

  return (
    <div className="py-2" ref={containerRef}>
      <div className="flex space-x-2">
        {llmOptions.map((llm) => (
          <button
            key={llm.id}
            onClick={() => handleSelectLLM(llm.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-all ${
              llm.colorClass
            } ${
              selectedLLM === llm.id
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
        ))}
      </div>
    </div>
  );
};

export default SelectLLM;
