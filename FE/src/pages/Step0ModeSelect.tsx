import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ChartNoAxesCombined, Check, FileText } from "lucide-react";
import axios from "axios";
import useThemeStore from "../stores/useThemeStore";

// 세션 ID 생성 및 저장 함수
const createSessionId = () => {
  const sessionId = Math.random().toString(36).substring(2, 10);
  localStorage.setItem("sessionId", sessionId);
  return sessionId;
};

const roleUser = () => {
  const Role = "User";
  localStorage.setItem("role", Role);
};

const roleAdmin = () => {
  const Role = "Admin";
  localStorage.setItem("role", Role);
};

const saveBestLLM = async () => {
  try {
    const response = await axios.get("https://s-pat.site/api/user/LLM");
    localStorage.setItem("LLM", response.data.LLM);
    console.log("Best LLM saved successfully:", response.data.LLM);
  } catch (error) {
    console.error("Error saving best LLM:", error);
  }
};

const handleModeSelectUser = async () => {
  createSessionId();
  roleUser();
  await saveBestLLM();
};

const handleModeSelectAdmin = async () => {
  createSessionId();
  roleAdmin();
};

const Step0ModeSelect: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={`flex flex-col min-h-screen relative overflow-hidden ${
        isDarkMode
          ? "bg-[#1A1F30]" // 다크 모드 배경
          : "bg-gradient-to-br from-blue-50 via-white to-blue-50/30" // 라이트 모드 배경
      }`}>
      {/* 배경 그라데이션 효과 */}
      {isDarkMode ? (
        // 다크 모드 배경 효과
        <>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-900/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-800/15 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-gradient-to-tr from-cyan-800/15 to-transparent rounded-full blur-3xl"></div>
        </>
      ) : (
        // 라이트 모드 배경 효과
        <>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-100/30 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-gradient-to-tr from-cyan-100/20 to-transparent rounded-full blur-3xl"></div>
        </>
      )}

      <main className="flex-grow flex flex-col items-center justify-center p-8 relative z-10">
        <div className="max-w-4xl w-full backdrop-blur-sm">
          {/* 앱 소개 섹션 */}
          <div className="text-center mb-14">
            <h1
              className={`font-pretendard font-bold ${
                isDarkMode ? "text-white" : "text-primary-black"
              } text-5xl mb-6`}>
              S-PAT{" "}
              <span className="text-transparent bg-clip-text smooth-gradient">
                Samsung Patent AI Technology
              </span>
            </h1>

            <p
              className={`font-pretendard ${
                isDarkMode ? "text-gray-300" : "text-primary-gray"
              } text-lg max-w-2xl mx-auto`}>
              SPAT은 AI 기반 특허 분류 시스템으로, 효율적인 특허 관리와 분석을
              지원합니다.
            </p>
            <p
              className={`font-pretendard ${
                isDarkMode ? "text-gray-300" : "text-primary-gray"
              } text-lg max-w-2xl mx-auto mb-6`}>
              특허 문서를 빠르고 정확하게 분류하여 업무 효율성을 높이세요.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div
                className={`${
                  isDarkMode
                    ? "bg-[#23283D]/90 text-gray-200"
                    : "bg-white/80 text-gray-700"
                } backdrop-blur-sm shadow-sm font-pretendard px-4 py-2 rounded-full text-sm font-medium flex items-center`}>
                <BadgeCheck
                  className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400"
                  fill="currentColor"
                  color={isDarkMode ? "#23283D" : "white"}
                  strokeWidth={1}
                />
                AI 기반 분류
              </div>
              <div
                className={`${
                  isDarkMode
                    ? "bg-[#23283D]/90 text-gray-200"
                    : "bg-white/80 text-gray-700"
                } backdrop-blur-sm shadow-sm font-pretendard px-4 py-2 rounded-full text-sm font-medium flex items-center`}>
                <FileText
                  className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400"
                  fill="currentColor"
                  color={isDarkMode ? "#23283D" : "white"}
                  strokeWidth={1}
                />
                특허 문서 관리
              </div>
              <div
                className={`${
                  isDarkMode
                    ? "bg-[#23283D]/90 text-gray-200"
                    : "bg-white/80 text-gray-700"
                } backdrop-blur-sm shadow-sm font-pretendard px-4 py-2 rounded-full text-sm font-medium flex items-center`}>
                <ChartNoAxesCombined className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
                데이터 분석
              </div>
            </div>
          </div>

          {/* 모드 선택 섹션 */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {/* 사용자 모드 */}
            <Link
              to="/user/step1"
              onClick={() => handleModeSelectUser()}
              className={`flex-1 p-6 rounded-lg ${
                isDarkMode
                  ? "bg-[#23283D]/90 border-[#414864] hover:border-[#5C6890] hover:bg-[#2A3048]/90"
                  : "bg-white/90 border-blue-100 hover:border-blue-300 hover:bg-blue-50/90"
              } backdrop-blur-sm border-2 shadow-md hover:shadow-lg transition-all`}>
              <div className="flex items-center mb-4">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } font-pretendard`}>
                  사용자 모드
                </h2>
              </div>

              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-primary-gray"
                } mb-4 font-pretendard`}>
                자신만의 기술 분류 체계로 특허를 스마트하게 정리하세요. 최적화된
                AI가 복잡한 특허 문서를 정확히 분류합니다.
              </p>

              <ul
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } space-y-2 ml-1 font-pretendard`}>
                <li className="flex items-center ">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400"
                  />
                  사용자 맞춤화 특허 분류 체계 생성
                </li>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400"
                  />
                  AI 기반 특허 데이터 자동 분류
                </li>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400"
                  />
                  분류 결과 확인 및 다운로드
                </li>
              </ul>
            </Link>

            {/* 관리자 모드 */}
            <Link
              to="/admin/step1"
              onClick={() => handleModeSelectAdmin()}
              className={`flex-1 p-6 rounded-lg ${
                isDarkMode
                  ? "bg-[#23283D]/90 border-[#414864] hover:border-[#5C6890] hover:bg-[#2A3048]/90"
                  : "bg-white/90 border-blue-100 hover:border-blue-300 hover:bg-blue-50/90"
              } backdrop-blur-sm border-2 shadow-md hover:shadow-lg transition-all`}>
              <div className="flex items-center mb-4">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } font-pretendard`}>
                  전문가 모드
                </h2>
              </div>

              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-primary-gray"
                } mb-4 font-pretendard`}>
                최신 LLM들의 특허 분류 성능을 객관적으로 비교하고 평가하세요.
                정밀한 분석을 통해 가장 효과적인 AI 모델을 선별합니다.
              </p>

              <ul
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } space-y-2 ml-1 font-pretendard`}>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400"
                  />
                  다중 LLM 병렬 분류
                </li>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400"
                  />
                  벡터 유사도 기반 정량적 평가
                </li>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400"
                  />
                  LLM 자체 평가 및 전문가 피드백 시스템
                </li>
              </ul>
            </Link>
          </div>
        </div>
      </main>

      {/* 웨이브 애니메이션을 위한 스타일 */}
      <style>{`
        .smooth-gradient {
          background-image: linear-gradient(
            270deg, 
            ${
              isDarkMode
                ? "#60A5FA, #1E40AF, #60A5FA"
                : "#3B82F6, #0D2473, #3B82F6"
            }
          );
          background-size: 200% 100%;
          animation: moveGradient 4s linear infinite;
          background-clip: text;
        }
        
        @keyframes moveGradient {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Step0ModeSelect;
