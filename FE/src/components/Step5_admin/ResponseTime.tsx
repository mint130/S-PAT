import { Clock4 } from "lucide-react";
import useLLMStore from "../../stores/useLLMStore";

const ResponseTime = () => {
  // Zustand 스토어에서 LLM 데이터 가져오기
  const llmData = useLLMStore((state) => state.llmData);

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
        <span className="font-bold font-pretendard">응답 시간</span>
      </div>

      {/* 카드 - 높이를 100%로 설정하고 내부 컨텐츠를 flex로 중앙에 배치 */}
      <div className="bg-white rounded-lg shadow-sm p-4 h-full flex items-center">
        {/* 그리드 레이아웃 */}
        <div className="grid grid-cols-4 gap-4 w-full">
          {llmData.map((item) => (
            <div
              key={item.name}
              className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center shadow-sm">
              <div className="font-pretendard text-sm text-gray-500">
                {item.name}
              </div>
              <div className="font-pretendard text-xs text-gray-400 mt-1">
                응답 시간
              </div>
              <div className="text-xl font-semibold font-pretendard mt-2">
                {formatTime(item.time)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponseTime;
