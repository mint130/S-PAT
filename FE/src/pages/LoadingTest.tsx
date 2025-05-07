import { useState, useEffect } from "react";

interface ClassificationProgressProps {
  totalPatents: number;
  classifiedPatents: number;
  currentPhase: string;
  estimatedTimeLeft: string;
  onComplete?: () => void;
}

function LoadingTest() {
  // 테스트용 더미 데이터
  const [progress, setProgress] = useState<ClassificationProgressProps>({
    totalPatents: 100,
    classifiedPatents: 0,
    currentPhase: "특허 데이터 분석 중",
    estimatedTimeLeft: "약 5분",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newClassified = prev.classifiedPatents + 1;
        const isComplete = newClassified >= prev.totalPatents;
        if (isComplete) {
          clearInterval(interval);
          if (progress.onComplete) progress.onComplete();
        }
        let phase = prev.currentPhase;
        let timeLeft = prev.estimatedTimeLeft;
        if (newClassified < 30) {
          phase = "특허 데이터 분석 중";
          timeLeft = "약 4분";
        } else if (newClassified < 60) {
          phase = "특허 분류 모델 적용 중";
          timeLeft = "약 3분";
        } else if (newClassified < 90) {
          phase = "분류 결과 정리 중";
          timeLeft = "약 1분";
        } else {
          phase = "최종 분류 완료 중";
          timeLeft = "1분 미만";
        }
        return {
          ...prev,
          classifiedPatents: newClassified,
          currentPhase: phase,
          estimatedTimeLeft: timeLeft,
        };
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const progressPercentage =
    (progress.classifiedPatents / progress.totalPatents) * 100;

  return (
    <div className="h-screen flex flex-col items-center justify-center  p-4">
      <div className="w-full max-w-md rounded-2xl p-8 flex flex-col items-center">
        <h1 className="text-xl font-bold text-gray-800 mb-2">특허 분류 중</h1>
        <p className="text-gray-500 mb-8">{progress.currentPhase}</p>
        {/* 입체감 있는 3D 로딩 스피너 */}
        <div
          className="relative flex flex-col items-center mb-8"
          style={{ height: 160 }}>
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* 3D 입체감 스피너 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="block w-full h-full rounded-full bg-gradient-to-br from-emerald-200 via-white to-blue-200 shadow-xl"
                style={{ filter: "blur(2px)", opacity: 0.7 }}></span>
            </div>
            <svg
              className="relative z-10"
              width="112"
              height="112"
              viewBox="0 0 112 112">
              <defs>
                <linearGradient
                  id="spinner-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <filter
                  id="shadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%">
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="4"
                    floodColor="#60a5fa"
                    floodOpacity="0.15"
                  />
                </filter>
              </defs>
              <circle
                cx="56"
                cy="56"
                r="44"
                stroke="#e0e7ef"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="56"
                cy="56"
                r="44"
                stroke="url(#spinner-gradient)"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={
                  2 * Math.PI * 44 * (1 - progressPercentage / 100)
                }
                fill="none"
                strokeLinecap="round"
                style={{
                  filter: "url(#shadow)",
                  transition:
                    "stroke-dashoffset 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}></circle>
            </svg>
            {/* 중앙 그림자 효과 */}
            <div className="absolute left-1/2 top-[90%] w-16 h-4 bg-blue-100 rounded-full blur-sm opacity-60 -translate-x-1/2"></div>
            {/* 중앙 진행률 텍스트 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-2xl font-bold text-emerald-500 drop-shadow-sm">
                {Math.floor(progressPercentage)}%
              </span>
            </div>
          </div>
          {/* 분석 진행 텍스트 */}
          <div className="mt-6 text-base text-gray-700 font-medium tracking-tight">
            특허 {progress.classifiedPatents} / {progress.totalPatents} 분석
            중...
          </div>
        </div>
        {/* 진행 상태 바 */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>진행률</span>
            <span>
              {progress.classifiedPatents} / {progress.totalPatents} 특허
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
        {/* 정보 카드 */}
        <div className="grid grid-cols-3 gap-3 w-full mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">예상 시간</div>
            <div className="text-base font-semibold text-gray-700">
              {progress.estimatedTimeLeft}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">처리됨</div>
            <div className="text-base font-semibold text-gray-700">
              {progress.classifiedPatents}개
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">남음</div>
            <div className="text-base font-semibold text-gray-700">
              {progress.totalPatents - progress.classifiedPatents}개
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingTest;
