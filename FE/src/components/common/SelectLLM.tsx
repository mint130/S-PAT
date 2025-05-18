import { useRef } from "react";
import ChatGPTIcon from "../../assets/gpt.png";
import ClaudeIcon from "../../assets/claude.png";
import GeminiIcon from "../../assets/gemini.png";
import GrokIcon from "../../assets/grok.png";
import useLLMStore from "../../stores/useLLMStore";
import useThemeStore from "../../stores/useThemeStore";

// 디스플레이 이름과 데이터 이름 간의 매핑 (모두 대문자로 통일)
const displayToDataNameMap: Record<string, string> = {
  GPT: "GPT",
  CLAUDE: "CLAUDE",
  GEMINI: "GEMINI",
  GROK: "GROK",
};

// LLM 옵션 인터페이스 정의
interface LLMOption {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
  darkColorClass: string;
}

const SelectLLM = () => {
  // Zustand 스토어에서 선택된 LLM 상태와 설정 함수 가져오기
  const selectedLLM = useLLMStore((state) => state.selectedLLM);
  const setSelectedLLM = useLLMStore((state) => state.setSelectedLLM);
  const { isDarkMode } = useThemeStore();

  const containerRef = useRef<HTMLDivElement>(null);

  // LLM 옵션 목록 (id는 대문자, name은 표시용으로 첫 글자만 대문자)
  const llmOptions: LLMOption[] = [
    {
      id: "GPT",
      name: "GPT",
      icon: ChatGPTIcon,
      colorClass: "text-GPT",
      darkColorClass: "dark:text-GPT-dark",
    },
    {
      id: "CLAUDE",
      name: "Claude",
      icon: ClaudeIcon,
      colorClass: "text-Claude",
      darkColorClass: "dark:text-Claude-dark",
    },
    {
      id: "GEMINI",
      name: "Gemini",
      icon: GeminiIcon,
      colorClass: "text-Gemini",
      darkColorClass: "dark:text-Gemini-dark",
    },
    {
      id: "GROK",
      name: "Grok",
      icon: GrokIcon,
      colorClass: "text-Grok",
      darkColorClass: "dark:text-Grok-dark",
    },
  ];

  // LLM 선택 핸들러
  const handleSelectLLM = (displayName: string) => {
    const dataName = displayToDataNameMap[displayName];

    if (selectedLLM === dataName) {
      setSelectedLLM(null);
    } else {
      setSelectedLLM(dataName);
    }
  };

  return (
    <div ref={containerRef}>
      <div className="flex space-x-2">
        {llmOptions.map((llm) => {
          const isSelected = selectedLLM === displayToDataNameMap[llm.id];

          return (
            <button
              key={llm.id}
              onClick={() => handleSelectLLM(llm.id)}
              className={`flex items-center justify-center w-28 px-3 py-2 rounded-md ${
                llm.colorClass
              } ${llm.darkColorClass} ${
                isSelected
                  ? `bg-select-box dark:bg-[#1A3A6B] font-medium border border-select-box-border-soild dark:border-[#60A5FA]`
                  : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#353E5C]"
              }`}>
              {llm.id === "GROK" ? (
                <img
                  src={llm.icon}
                  alt={`${llm.name} 아이콘`}
                  className={`w-5 h-5 mr-2 ${
                    isDarkMode ? "filter invert brightness-100" : ""
                  }`}
                />
              ) : (
                <img
                  src={llm.icon}
                  alt={`${llm.name} 아이콘`}
                  className={`w-5 h-5 mr-2 ${
                    isDarkMode ? "filter brightness-110" : ""
                  }`}
                />
              )}
              <span className="dark:text-gray-200">{llm.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectLLM;
