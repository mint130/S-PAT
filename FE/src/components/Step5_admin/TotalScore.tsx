import { Crown } from "lucide-react";
import { useMemo, useEffect } from "react";
import useLLMStore from "../../stores/useLLMStore";
import useThemeStore from "../../stores/useThemeStore";

const TotalScore = () => {
  // Zustand 스토어에서 LLM 데이터와 선택된 LLM 가져오기
  const llmData = useLLMStore((state) => state.llmData);
  const selectedLLM = useLLMStore((state) => state.selectedLLM);
  const { isDarkMode } = useThemeStore();

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

  const calculatedScores = useMemo(() => {
    return llmData.map((model) => {
      // 각 항목은 0-1 사이의 값이므로 100을 곱하여 100점 만점으로 변환
      const totalScore = Math.round(
        (model.vector_accuracy * 0.2 +
          model.reasoning_score * 0.4 +
          model.expert * 0.4) *
          100
      );

      return {
        name: model.name,
        score: totalScore,
        // 모델명에 따라 색상 지정 (라이트/다크 모드)
        color:
          model.name === "GPT"
            ? "#10A37F" // 화이트모드에서도 동일한 색상 사용
            : model.name === "CLAUDE"
            ? isDarkMode
              ? "#EF8354"
              : "#D77757"
            : model.name === "GEMINI"
            ? isDarkMode
              ? "#64A7FF"
              : "#3693DA"
            : isDarkMode
            ? "#A8B2D1"
            : "#999999", // Grok 색상
      };
    });
  }, [llmData, isDarkMode]);

  // 점수에 따른 크기 계산 함수 (선택된 LLM은 더 크게)
  const calculateSize = (score: number, isSelected: boolean) => {
    const minScore = 70; // 최소 점수 (이 값은 데이터에 따라 조정 가능)
    const maxScore = 100; // 최대 점수
    const minSize = 100; // 최소 크기 (px)
    const maxSize = 120; // 최대 크기 (px)

    // 기본 크기 계산
    const baseSize =
      minSize +
      ((score - minScore) / (maxScore - minScore)) * (maxSize - minSize);

    // 선택된 LLM은 더 크게 (20px 추가)
    return isSelected ? baseSize + 20 : baseSize;
  };

  // 애니메이션을 위한 상태 추가
  useEffect(() => {
    // 선택이 변경될 때 애니메이션을 트리거
    const circles = document.querySelectorAll(".progress-circle");
    circles.forEach((circle) => {
      circle.classList.remove("animate-draw");
      // 짧은 지연 후 클래스를 다시 추가하여 애니메이션 재시작
      setTimeout(() => {
        const modelName = circle.getAttribute("data-model");
        // 선택된 LLM이 없거나, 현재 원이 선택된 LLM인 경우에만 애니메이션 적용
        if (!selectedLLM || selectedLLM === modelName) {
          circle.classList.add("animate-draw");
        }
      }, 10);
    });
  }, [selectedLLM]);

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-pretendard font-semibold mb-2 flex items-center text-sm text-gray-900 dark:text-gray-100">
        <span className="mr-2">
          <Crown size={16} className="text-gray-900 dark:text-gray-100" />
        </span>
        종합 점수
      </h3>
      <div className="bg-white dark:bg-[#23283D] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex-1 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full relative">
          {/* 애니메이션 스타일 추가 */}
          <style>
            {`
              @keyframes drawCircle {
                from {
                  stroke-dashoffset: var(--circumference);
                }
                to {
                  stroke-dashoffset: var(--offset);
                }
              }
              
              .animate-draw {
                animation: drawCircle 1.5s ease-in-out forwards;
              }
            `}
          </style>

          {calculatedScores.map((model, index) => {
            // 선택된 LLM인지 확인
            const isSelected = !selectedLLM || selectedLLM === model.name;
            const size = calculateSize(model.score, isSelected);

            // 프로그레스 바 크기는 원보다 약간 더 크게
            const progressSize = size + 16;

            // 점수를 퍼센트로 변환 (프로그레스 바 계산용)
            const scorePercent = model.score / 100;

            // 프로그레스 바 스트로크 두께
            const strokeWidth = 2;

            // 원 둘레 계산
            const circumference =
              2 * Math.PI * ((progressSize - strokeWidth) / 2);

            // 프로그레스 값에 따른 스트로크 대시 길이
            const progressOffset = circumference - scorePercent * circumference;

            // 위치 계산 - 넓게 퍼진 배치
            let posX, posY;

            switch (index) {
              case 0: // GPT - 중앙 약간 왼쪽
                posX = "20%";
                posY = "60%";
                break;
              case 1: // Claude - 오른쪽 상단
                posX = "40%";
                posY = "60%";
                break;
              case 2: // Gemini - 왼쪽 하단
                posX = "60%";
                posY = "40%";
                break;
              case 3: // Grok - 오른쪽 하단
                posX = "80%";
                posY = "55%";
                break;
              default:
                posX = "50%";
                posY = "50%";
            }

            // 색상 적용 (다크모드 대응)
            let backgroundColor, progressColor;

            if (model.name === "GPT") {
              // GPT는 모든 모드에서 동일한 색상 사용
              backgroundColor = `rgba(16, 163, 127, ${
                isSelected ? 0.85 : 0.5
              })`;
              progressColor = `rgba(34, 197, 147, ${isSelected ? 0.9 : 0.6})`;
            } else if (model.name === "CLAUDE") {
              backgroundColor = isDarkMode
                ? `rgba(239, 131, 84, ${isSelected ? 0.85 : 0.5})`
                : `rgba(215, 119, 87, ${isSelected ? 0.85 : 0.5})`;
              progressColor = isDarkMode
                ? `rgba(255, 150, 103, ${isSelected ? 0.9 : 0.6})`
                : `rgba(224, 138, 108, ${isSelected ? 0.9 : 0.6})`;
            } else if (model.name === "GEMINI") {
              backgroundColor = isDarkMode
                ? `rgba(100, 167, 255, ${isSelected ? 0.85 : 0.5})`
                : `rgba(54, 147, 218, ${isSelected ? 0.85 : 0.5})`;
              progressColor = isDarkMode
                ? `rgba(130, 190, 255, ${isSelected ? 0.9 : 0.6})`
                : `rgba(74, 168, 240, ${isSelected ? 0.9 : 0.6})`;
            } else if (model.name === "GROK") {
              backgroundColor = isDarkMode
                ? `rgba(168, 178, 209, ${isSelected ? 0.85 : 0.5})`
                : `rgba(153, 153, 153, ${isSelected ? 0.85 : 0.5})`;
              progressColor = isDarkMode
                ? `rgba(188, 198, 229, ${isSelected ? 0.9 : 0.6})`
                : `rgba(187, 187, 187, ${isSelected ? 0.9 : 0.6})`;
            }

            // 점수가 높을수록 앞에 표시 (z-index 조정) + 선택된 LLM은 항상 가장 앞에
            const zIndex = isSelected ? 100 + model.score : model.score;

            return (
              <div
                key={model.name}
                className={`absolute transition-all duration-500 ease-in-out`}
                style={{
                  top: posY,
                  left: posX,
                  transform: "translate(-50%, -50%)",
                  width: `${progressSize}px`,
                  height: `${progressSize}px`,
                  zIndex,
                  // 선택된 LLM이 아니면 약간 흐리게
                  filter: isSelected ? "none" : "blur(1px)",
                  // 선택된 LLM은 약간 커지는 효과
                  scale: isSelected ? "1.1" : "1",
                }}>
                {/* SVG 원형 프로그레스 바 */}
                <svg
                  width={progressSize}
                  height={progressSize}
                  className="absolute top-0 left-0"
                  style={{
                    transform: "rotate(-90deg)", // 12시 방향에서 시작하도록 회전
                    filter: isSelected
                      ? "drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5))"
                      : "drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.3))",
                    opacity: isSelected ? 1 : 0.7, // 선택되지 않은 LLM은 더 투명하게
                    transition: "all 0.5s ease-in-out",
                  }}>
                  {/* 백그라운드 서클 (전체 원) */}
                  <circle
                    cx={progressSize / 2}
                    cy={progressSize / 2}
                    r={(progressSize - strokeWidth) / 2}
                    fill="none"
                    stroke={
                      isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.15)"
                    }
                    strokeWidth={strokeWidth}
                  />
                  {/* 프로그레스 서클 (채워진 부분) - 애니메이션 조건 적용 */}
                  <circle
                    className="progress-circle"
                    data-model={model.name}
                    cx={progressSize / 2}
                    cy={progressSize / 2}
                    r={(progressSize - strokeWidth) / 2}
                    fill="none"
                    stroke={progressColor}
                    strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth} // 선택된 LLM은 더 두껍게
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    style={{
                      filter: "blur(0.5px)", // 약간의 블러 효과
                      ["--circumference" as any]: circumference,
                      ["--offset" as any]: progressOffset,
                    }}
                  />
                  {/* 움직이는 점 효과 (선택사항) */}
                  <circle
                    cx={progressSize / 2}
                    cy={strokeWidth / 2}
                    r={isSelected ? strokeWidth + 1 : strokeWidth} // 선택된 LLM은 점도 더 크게
                    fill={
                      isSelected
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.7)"
                    }
                    className={isSelected ? "animate-pulse" : ""}
                    style={{
                      transformOrigin: `${progressSize / 2}px ${
                        progressSize / 2
                      }px`,
                      transform: `rotate(${scorePercent * 360}deg)`,
                      filter: "blur(0.5px)", // 약간의 블러 효과
                      transition: `transform 1.5s ease-in-out`,
                    }}
                  />
                </svg>

                {/* 내부 원 (점수 컨테이너) - 투명도 추가 */}
                <div
                  className="absolute flex flex-col items-center justify-center rounded-full text-white backdrop-blur-sm"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor,
                    boxShadow: isSelected
                      ? `0 0 15px ${model.color}70` // 선택된 LLM은 발광 효과
                      : isDarkMode
                      ? "0 0.125rem 0.625rem rgba(0, 0, 0, 0.4)"
                      : "0 0.125rem 0.625rem rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(2px)", // 배경 블러 효과 (지원되는 브라우저에서만)
                  }}>
                  {/* 점수 표시 */}
                  <div
                    className={`font-pretendard font-bold ${
                      isSelected ? "text-2xl" : "text-xl"
                    } transition-all duration-300`}>
                    {model.score}점
                  </div>

                  {/* 모델명 표시 */}
                  <div className="font-pretendard text-sm mt-1">
                    {getDisplayName(model.name)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TotalScore;
