import { Clock4 } from "lucide-react";
import useLLMStore from "../../stores/useLLMStore";

const ResponseTime = () => {
  // Zustand 스토어에서 LLM 데이터와 선택된 LLM 가져오기
  const llmData = useLLMStore((state) => state.llmData);
  const selectedLLM = useLLMStore((state) => state.selectedLLM);

  // 시간을 분:초 형식으로 변환하는 함수
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}m ${seconds}s`;
  };

  // LLM별 색상 클래스 매핑
  const getLLMColorClass = (name: string): string => {
    switch (name) {
      case "GPT":
        return "text-GPT"; // #000000
      case "Claude":
        return "text-Claude"; // #D77757
      case "Gemini":
        return "text-Gemini"; // #3693DA
      case "Grok":
        return "text-Grok2"; // #999999 (Grok2 사용 - 회색)
      default:
        return "text-black";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-2">
        <Clock4 size={18} className="mr-2" />
        <span className="font-semibold font-pretendard text-sm">응답 시간</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 h-full flex items-center">
        {/* 2x2 그리드로 변경 - 너비 제한 제거/확대 */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {llmData.map((item) => {
            // LLM별 고유 색상 클래스
            const llmColorClass = getLLMColorClass(item.name);

            // 스타일을 결정하는 로직
            let containerStyle, titleStyle, timeStyle;

            if (selectedLLM === null) {
              // 경우 1: 아무것도 선택되지 않은 상태
              containerStyle = "bg-white shadow-sm";
              titleStyle = llmColorClass; // 각 LLM별 고유 색상 사용
              timeStyle = "text-black";
            } else if (selectedLLM === item.name) {
              // 경우 2: 현재 아이템이 선택된 상태
              containerStyle = "border-2 border-blue-500 bg-blue-50 shadow-sm";
              titleStyle = llmColorClass; // 선택되어도 고유 색상 유지
              timeStyle = "text-blue-600";
            } else {
              // 경우 3: 다른 아이템이 선택된 상태
              containerStyle = "opacity-60 shadow-sm";
              titleStyle = "text-gray-500"; // 선택되지 않은 것은 회색 처리
              timeStyle = "text-gray-500";
            }

            return (
              <div
                key={item.name}
                className={`
                  rounded-lg px-6 py-4 flex flex-row justify-between items-center
                  transition-all duration-300
                  ${containerStyle}
                `}>
                {/* 왼쪽: LLM 정보 */}
                <div className="flex flex-col">
                  <div
                    className={`font-pretendard text-lg font-medium ${titleStyle}`}>
                    {item.name}
                  </div>
                  <div className="font-pretendard text-xs text-gray-400">
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
