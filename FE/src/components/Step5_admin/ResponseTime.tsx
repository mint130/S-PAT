import { Clock4 } from "lucide-react";
import useLLMStore from "../../stores/useLLMStore";
import useThemeStore from "../../stores/useThemeStore";

const ResponseTime = () => {
  // Zustand 스토어에서 LLM 데이터와 선택된 LLM 가져오기
  const llmData = useLLMStore((state) => state.llmData);
  const selectedLLM = useLLMStore((state) => state.selectedLLM);
  const { isDarkMode } = useThemeStore();

  // 시간을 시:분:초 형식으로 변환하는 함수 (각 단위가 0이면 표시하지 않음)
  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    let formattedTime = "";

    if (hours > 0) {
      formattedTime += `${hours}h `;
    }

    if (minutes > 0 || hours > 0) {
      formattedTime += `${minutes}m `;
    }

    formattedTime += `${seconds}s`;

    return formattedTime;
  };

  // 표시용 이름으로 변환하는 함수
  const getDisplayName = (name: string): string => {
    switch (name) {
      case "GPT":
        return "GPT";
      case "CLAUDE":
        return "Claude";
      case "GEMINI":
        return "Gemini";
      case "GROK":
        return "Grok";
      default:
        return name;
    }
  };

  // LLM별 색상 클래스 매핑
  const getLLMColorClass = (name: string): string => {
    switch (name) {
      case "GPT":
        return "text-GPT dark:text-[#10A37F]"; // 다크모드에서는 OpenAI 그린
      case "CLAUDE":
        return "text-Claude dark:text-[#EF8354]"; // 다크모드에서는 밝은 오렌지
      case "GEMINI":
        return "text-Gemini dark:text-[#64A7FF]"; // 다크모드에서는 밝은 블루
      case "GROK":
        return "text-Grok2 dark:text-[#A8B2D1]"; // 다크모드에서는 밝은 회색
      default:
        return "text-black dark:text-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-2">
        <Clock4 size={18} className="mr-2 text-gray-900 dark:text-gray-100" />
        <span className="font-semibold font-pretendard text-sm text-gray-900 dark:text-gray-100">
          응답 시간
        </span>
      </div>

      <div className="bg-white dark:bg-[#23283D] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-full flex items-center">
        {/* 2x2 그리드로 변경 - 너비 제한 제거/확대 */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {llmData.map((item) => {
            // LLM별 고유 색상 클래스
            const llmColorClass = getLLMColorClass(item.name);

            // 스타일을 결정하는 로직
            let containerStyle, titleStyle, timeStyle;

            if (selectedLLM === null) {
              // 경우 1: 아무것도 선택되지 않은 상태
              containerStyle = isDarkMode
                ? "bg-[#2A2F45] dark:border-gray-700 shadow-sm"
                : "bg-white shadow-sm";
              titleStyle = llmColorClass; // 각 LLM별 고유 색상 사용
              timeStyle = isDarkMode ? "text-gray-200" : "text-black";
            } else if (selectedLLM === item.name) {
              // 경우 2: 현재 아이템이 선택된 상태
              containerStyle = isDarkMode
                ? "border-2 border-blue-500 bg-[#1A3A6B] shadow-sm"
                : "border-2 border-blue-500 bg-blue-50 shadow-sm";
              titleStyle = llmColorClass; // 선택되어도 고유 색상 유지
              timeStyle = isDarkMode ? "text-blue-400" : "text-blue-600";
            } else {
              // 경우 3: 다른 아이템이 선택된 상태
              containerStyle = isDarkMode
                ? "opacity-60 bg-[#1E243A] shadow-sm"
                : "opacity-60 shadow-sm";
              titleStyle = isDarkMode ? "text-gray-500" : "text-gray-500";
              timeStyle = isDarkMode ? "text-gray-500" : "text-gray-500";
            }

            return (
              <div
                key={item.name}
                className={`
                  rounded-lg px-6 py-4 flex flex-row justify-between items-center border
                  ${containerStyle}
                  ${isDarkMode ? "border-gray-700" : "border-gray-200"}
                `}>
                {/* 왼쪽: LLM 정보 */}
                <div className="flex flex-col">
                  <div
                    className={`font-pretendard text-lg font-medium ${titleStyle}`}>
                    {getDisplayName(item.name)}
                  </div>
                  <div className="font-pretendard text-xs text-gray-400 dark:text-white">
                    응답 시간
                  </div>
                </div>

                {/* 오른쪽: 시간 */}
                <div
                  className={`text-lg font-semibold font-pretendard ${timeStyle}`}>
                  {formatTime(item.time)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResponseTime;
