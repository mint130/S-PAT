import { useState, useEffect } from "react";

interface UserLoadingProps {
  sessionId: string;
  onComplete?: (data?: unknown) => void;
}

function UserLoading({ sessionId, onComplete }: UserLoadingProps) {
  // 진행률 상태 정의 및 타입 명시
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    percentage: number;
    currentPhase: string;
    estimatedTimeLeft: string;
  }>({
    current: 0,
    total: 100,
    percentage: 0,
    currentPhase: "AI가 특허데이터를 분류하고 있습니다...",
    estimatedTimeLeft: "계산 중...",
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    // 시작 시간 기록 (남은 시간 계산용)
    const startTime = Date.now();

    // SSE 연결 설정
    const connectSSE = () => {
      try {
        // 기존 연결이 있으면 닫기
        if (eventSource) {
          eventSource.close();
        }

        // 새 이벤트 소스 생성
        eventSource = new EventSource(
          `https://s-pat.site/api/test/${sessionId}/progress`
        );

        // 연결 열림 이벤트
        eventSource.onopen = () => {
          console.log("SSE 연결됨");
        };

        // 메시지 수신 이벤트
        eventSource.onmessage = (event) => {
          // 원본 데이터 로깅 (추가)
          console.log("원본 SSE 데이터:", event.data);
          console.log("데이터 타입:", typeof event.data);

          const data = JSON.parse(event.data) as {
            current?: number;
            total?: number;
            percentage?: number;
            status?: string;
            message?: string;
          };

          console.log("SSE 데이터 수신:", data);

          // 완료 메시지 처리
          if (data.status === "completed") {
            setIsComplete(true);
            eventSource?.close();

            // 완료 후 1초 대기 후 콜백 실행
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 1000);
            return;
          }

          // 진행 상황 업데이트 (current, total, percentage가 있는 경우만)
          if (
            data.current !== undefined &&
            data.total !== undefined &&
            data.percentage !== undefined
          ) {
            setProgress((prevState) => {
              // 예상 남은 시간 계산 (평균 처리 시간으로 예측)
              const elapsedTime = Date.now() - startTime;
              const avgTimePerItem =
                data.current! > 0 ? elapsedTime / data.current! : 0;
              const remainingItems = data.total! - data.current!;
              const estimatedTimeMs = avgTimePerItem * remainingItems;

              // 남은 시간을 분 단위로 변환 (최소 1분)
              const remainingMinutes = Math.max(
                1,
                Math.ceil(estimatedTimeMs / (1000 * 60))
              );

              return {
                current: data.current!,
                total: data.total!,
                percentage: data.percentage!,
                currentPhase: prevState.currentPhase, // 기존 메시지 유지
                estimatedTimeLeft: `약 ${remainingMinutes}분`,
              };
            });
          }
        };

        // 에러 처리
        eventSource.onerror = (error) => {
          console.error("SSE 에러:", error);

          // 연결 재시도
          eventSource?.close();
          setTimeout(connectSSE, 3000);
        };
      } catch (error) {
        console.error("SSE 연결 에러:", error);
      }
    };

    // SSE 연결 시작
    connectSSE();

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (eventSource) {
        console.log("SSE 연결 종료");
        eventSource.close();
      }
    };
  }, [sessionId, onComplete]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-2xl p-8 flex flex-col items-center">
        <div
          className="relative flex flex-col items-center mb-6"
          style={{ height: 240 }}>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Ripple Effect - 완료되면 보이지 않음 */}
            {!isComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-400"
                  style={{
                    animation: "ripple 4s infinite",
                    opacity: 0.15,
                  }}></div>
                <div
                  className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-400"
                  style={{
                    animation: "ripple 4s infinite 1s",
                    opacity: 0.15,
                  }}></div>
                <div
                  className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-400"
                  style={{
                    animation: "ripple 4s infinite 2s",
                    opacity: 0.15,
                  }}></div>
              </div>
            )}

            {/* 완료되면 표시되는 원 */}
            {isComplete && (
              <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-blue-400 opacity-15"></div>
            )}

            {/* 중앙 진행률 텍스트 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {Math.floor(progress.percentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* 텍스트 섹션 */}
        <div className="w-full text-center space-y-3">
          {!isComplete ? (
            <>
              <h3 className="text-xl font-semibold text-gray-800 font-pretendard mt-12">
                {progress.currentPhase}
              </h3>
              <div className="flex flex-col items-center space-y-2">
                <p className="text-gray-600 font-pretendard">
                  총 <span className="font-medium">{progress.total}</span>개 중{" "}
                  <span className="font-medium">{progress.current}</span>개
                  처리됨
                </p>
                <p className="text-gray-500 text-sm font-pretendard">
                  예상 남은 시간: {progress.estimatedTimeLeft}
                </p>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-gray-800 font-pretendard">
                AI 분류 완료
              </h3>
              <p className="text-gray-600 font-pretendard mt-2">
                분류 결과 페이지로 이동합니다...
              </p>
            </>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 0.2;
            }
            50% {
              opacity: 0.1;
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

export default UserLoading;
