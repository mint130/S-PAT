import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useThemeStore from "../../stores/useThemeStore";
import { CircleCheck } from "lucide-react";

interface AIModelProgressProps {
  id: number;
  name: string;
  totalPatents: number;
  classifiedPatents: number;
  estimatedTimeLeft: string;
  isComplete: boolean;
}

interface MultiAILoadingScreenProps {
  sessionId: string;
  fileLength: number;
}

function MultiAILoadingScreen({
  sessionId,
  fileLength,
}: MultiAILoadingScreenProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  // 4개 AI 모델의 상태 설정
  const [aiModels, setAiModels] = useState<AIModelProgressProps[]>([
    {
      id: 1,
      name: "GPT",
      totalPatents: fileLength,
      classifiedPatents: 0,
      estimatedTimeLeft: "계산 중...",
      isComplete: false,
    },
    {
      id: 2,
      name: "Claude",
      totalPatents: fileLength,
      classifiedPatents: 0,
      estimatedTimeLeft: "계산 중...",
      isComplete: false,
    },
    {
      id: 3,
      name: "Gemini",
      totalPatents: fileLength,
      classifiedPatents: 0,
      estimatedTimeLeft: "계산 중...",
      isComplete: false,
    },
    {
      id: 4,
      name: "Grok",
      totalPatents: fileLength,
      classifiedPatents: 0,
      estimatedTimeLeft: "계산 중...",
      isComplete: false,
    },
  ]);

  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    const sources: EventSource[] = [];
    const startTimes: Record<string, number> = {};

    console.log(isDarkMode);

    // 각 AI 모델에 대한 SSE 연결 설정
    aiModels.forEach((model) => {
      const url = `https://s-pat.site/api/admin/${sessionId}/progress?LLM=${model.name}`;
      const eventSource = new EventSource(url);

      startTimes[model.name] = Date.now();

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data) as {
          current?: number;
          total?: number;
          percentage?: number;
          status?: string;
          message?: string;
        };

        // 진행 상황 업데이트
        if (
          data.current !== undefined &&
          data.total !== undefined &&
          data.percentage !== undefined
        ) {
          setAiModels((prevModels) => {
            return prevModels.map((m) => {
              if (m.name === model.name) {
                // 예상 남은 시간 계산
                const elapsedTime = Date.now() - startTimes[model.name];
                const avgTimePerItem =
                  data.current! > 0 ? elapsedTime / data.current! : 0;
                const remainingItems = data.total! - data.current!;
                const estimatedTimeMs = avgTimePerItem * remainingItems;
                const remainingMinutes = Math.max(
                  1,
                  Math.ceil(estimatedTimeMs / (1000 * 60))
                );

                return {
                  ...m,
                  totalPatents: data.total!,
                  classifiedPatents: data.current!,
                  estimatedTimeLeft: `약 ${remainingMinutes}분`,
                  isComplete: false,
                };
              }
              return m;
            });
          });
        }

        // 완료 처리
        if (data.status === "completed") {
          setAiModels((prevModels) => {
            const updatedModels = prevModels.map((m) => {
              if (m.name === model.name) {
                return {
                  ...m,
                  classifiedPatents: m.totalPatents,
                  estimatedTimeLeft: "완료됨",
                  isComplete: true,
                };
              }
              return m;
            });

            // 모든 모델이 완료되었는지 확인
            const allDone = updatedModels.every((m) => m.isComplete);
            if (allDone) {
              setAllComplete(true);
            }

            return updatedModels;
          });

          eventSource.close();
        }
      };

      eventSource.onerror = (error) => {
        console.error(`SSE 에러 (${model.name}):`, error);
        // 재연결 로직
        setTimeout(() => {
          // 새로운 연결 시도
        }, 3000);
      };

      sources.push(eventSource);
    });

    // 클린업
    return () => {
      sources.forEach((source) => source.close());
    };
  }, [sessionId, isDarkMode]);

  // 전체 진행도 계산
  const totalProgress =
    Math.floor(
      (aiModels.reduce((sum, ai) => sum + ai.classifiedPatents, 0) /
        aiModels.reduce((sum, ai) => sum + ai.totalPatents, 0)) *
        100
    ) || 0;

  // 완료 후 Step4로 이동
  const handleComplete = () => {
    navigate("/admin/step4");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl p-8 flex flex-col items-center">
        {/* 중앙 진행률 원형 */}
        <div
          className="relative flex flex-col items-center mb-6"
          style={{ height: 240 }}>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Ripple Effect - 완료되면 보이지 않음 */}
            {!allComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-500 dark:to-blue-700"
                  style={{
                    animation: "ripple 4s infinite",
                    opacity: isDarkMode ? 0.2 : 0.15,
                  }}></div>
                <div
                  className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-500 dark:to-blue-700"
                  style={{
                    animation: "ripple 4s infinite 1s",
                    opacity: isDarkMode ? 0.2 : 0.15,
                  }}></div>
                <div
                  className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-500 dark:to-blue-700"
                  style={{
                    animation: "ripple 4s infinite 2s",
                    opacity: isDarkMode ? 0.2 : 0.15,
                  }}></div>
              </div>
            )}

            {/* 완료되면 표시되는 원 */}
            {allComplete && (
              <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-500 dark:to-blue-700 opacity-15 dark:opacity-20"></div>
            )}

            {/* 중앙 진행률 텍스트 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span
                className={`text-5xl font-bold ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                }`}>
                {totalProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* 텍스트 섹션 */}
        <div className="w-full text-center space-y-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-pretendard mt-4 mb-6">
            {allComplete
              ? "AI 분류 완료"
              : "AI가 특허데이터를 분류하고 있습니다..."}
          </h3>

          {/* 모델별 분류 상태 - 2열 그리드 */}
          <div className="grid grid-cols-2 gap-4">
            {aiModels.map((model) => {
              const progressPercentage =
                model.totalPatents > 0
                  ? Math.floor(
                      (model.classifiedPatents / model.totalPatents) * 100
                    )
                  : 0;

              return (
                <div
                  key={model.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {model.name}
                      </span>
                      {model.isComplete && (
                        <CircleCheck
                          className={`ml-2 ${
                            isDarkMode ? "text-blue-400" : "text-primary-blue"
                          }`}
                          size={16}
                        />
                      )}
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}></div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300 font-pretendard">
                      {model.classifiedPatents}/{model.totalPatents}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-pretendard">
                      {model.isComplete ? "완료" : model.estimatedTimeLeft}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 완료 버튼 */}
          {allComplete && (
            <div className="mt-8">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-pretendard"
                onClick={handleComplete}>
                분류 결과 확인하기
              </button>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: ${isDarkMode ? "0.25" : "0.2"};
            }
            50% {
              opacity: ${isDarkMode ? "0.15" : "0.1"};
            }
            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default MultiAILoadingScreen;
