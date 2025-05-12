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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-2">
        <Clock4 size={18} className="mr-2" />
        <span className="font-semibold font-pretendard">응답 시간</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 h-full flex items-center">
        <div className="grid grid-cols-4 gap-4 w-full">
          {llmData.map((item) => {
            // 선택된 LLM인지 확인
            const isSelected = !selectedLLM || selectedLLM === item.name;

            return (
              <div
                key={item.name}
                className={`
                  bg-gray-50 rounded-lg p-4 flex flex-col justify-center shadow-sm
                  ${
                    isSelected
                      ? "border-2 border-blue-500 bg-blue-50" // 선택된 LLM 강조
                      : "opacity-60"
                  } // 선택되지 않은 LLM 흐리게
                  transition-all duration-300
                `}>
                <div
                  className={`font-pretendard text-sm ${
                    isSelected ? "text-gray-800" : "text-gray-500"
                  }`}>
                  {item.name}
                </div>
                <div className="font-pretendard text-xs text-gray-400 mt-1">
                  응답 시간
                </div>
                <div
                  className={`text-xl font-semibold font-pretendard mt-2 ${
                    isSelected ? "text-blue-600" : "text-gray-500"
                  }`}>
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
