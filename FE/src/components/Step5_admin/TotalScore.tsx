import { Crown } from "lucide-react";
import { useMemo } from "react";
import useLLMStore from "../../stores/useLLMStore";

const TotalScore = () => {
  // Zustand 스토어에서 LLM 데이터와 선택된 LLM 가져오기
  const llmData = useLLMStore((state) => state.llmData);
  const selectedLLM = useLLMStore((state) => state.selectedLLM);

  // 종합 점수 계산 (similarity 20%, llmEval 40%, expert 40%)
  const calculatedScores = useMemo(() => {
    return llmData.map((model) => {
      // 각 항목은 0-1 사이의 값이므로 100을 곱하여 100점 만점으로 변환
      const totalScore = Math.round(
        (model.similarity * 0.2 + model.llmEval * 0.4 + model.expert * 0.4) *
          100
      );

      return {
        name: model.name,
        score: totalScore,
        // 모델명에 따라 색상 지정
        color:
          model.name === "GPT"
            ? "#000000"
            : model.name === "Claude"
            ? "#D77757"
            : model.name === "Gemini"
            ? "#3693DA"
            : "#999999", // Grok 색상
      };
    });
  }, [llmData]);

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

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-pretendard font-semibold mb-2 flex items-center">
        <span className="mr-2">
          <Crown size={16} />
        </span>
        종합 점수
      </h3>
      <div className="bg-white p-4 rounded-lg shadow-sm flex-1 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full relative">
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
            const circumference = 2 * Math.PI * (progressSize / 2);

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

            // 색상 적용 (배경색에 투명도 추가)
            let backgroundColor, progressColor;

            if (model.name === "GPT") {
              backgroundColor = `rgba(0, 0, 0, ${isSelected ? 0.85 : 0.5})`; // 선택되지 않은 경우 더 투명하게
              progressColor = `rgba(51, 51, 51, ${isSelected ? 0.9 : 0.6})`;
            } else if (model.name === "Claude") {
              backgroundColor = `rgba(215, 119, 87, ${
                isSelected ? 0.85 : 0.5
              })`;
              progressColor = `rgba(224, 138, 108, ${isSelected ? 0.9 : 0.6})`;
            } else if (model.name === "Gemini") {
              backgroundColor = `rgba(54, 147, 218, ${
                isSelected ? 0.85 : 0.5
              })`;
              progressColor = `rgba(74, 168, 240, ${isSelected ? 0.9 : 0.6})`;
            } else if (model.name === "Grok") {
              backgroundColor = `rgba(153, 153, 153, ${
                isSelected ? 0.85 : 0.5
              })`;
              progressColor = `rgba(187, 187, 187, ${isSelected ? 0.9 : 0.6})`;
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
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth={strokeWidth}
                  />
                  {/* 프로그레스 서클 (채워진 부분) */}
                  <circle
                    cx={progressSize / 2}
                    cy={progressSize / 2}
                    r={(progressSize - strokeWidth) / 2}
                    fill="none"
                    stroke={progressColor}
                    strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth} // 선택된 LLM은 더 두껍게
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-in-out"
                    style={{ filter: "blur(0.5px)" }} // 약간의 블러 효과
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
                    className="animate-pulse"
                    style={{
                      transformOrigin: `${progressSize / 2}px ${
                        progressSize / 2
                      }px`,
                      transform: `rotate(${scorePercent * 360}deg)`,
                      filter: "blur(0.5px)", // 약간의 블러 효과
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
                      : "0 0.125rem 0.625rem rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(2px)", // 배경 블러 효과 (지원되는 브라우저에서만)
                    transition: "all 0.5s ease-in-out",
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
                    {model.name}
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
