import React, { useState } from "react";
import { Moon, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import NextModal from "../common/NextModal";
import useThemeStore from "../../stores/useThemeStore";

const SideBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // admin인지 user인지 확인
  const isAdminMode = currentPath.includes("/admin");
  // const mode = isAdminMode ? "admin" : "user";

  // 현재 스텝 확인
  const currentStep = currentPath.includes("step1")
    ? 1
    : currentPath.includes("step2")
    ? 2
    : currentPath.includes("step3")
    ? 3
    : currentPath.includes("step4")
    ? 4
    : currentPath.includes("step5")
    ? 5
    : 1; // 기본값 step1

  // 다크모드 상태와 토글 함수 가져오기
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 다크 모드 토글 핸들러
  const handleDarkModeToggle = () => {
    toggleDarkMode();
    // HTML 요소에 dark 클래스 토글
    document.documentElement.classList.toggle("dark");
  };

  // 새 특허 버튼 클릭 핸들러
  const handleStartNewPatent = () => {
    setIsModalOpen(true);
  };

  // 모달 취소 핸들러
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // 모달 확인 핸들러
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate(`/`);
  };

  return (
    <>
      <div className="w-1/6 p-5 flex flex-col">
        {/* 로고 영역 */}
        {/* <div className="flex items-center justify-center mb-8 p-2">
          <h1 className="text-logo font-bold text-blue-600">S-PAT</h1>
        </div> */}
        {/* 로고 영역 */}
        <div className="flex items-center justify-center mb-8 p-2">
          <h1 className="text-logo font-bold bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 text-transparent bg-clip-text">
            S-PAT
          </h1>
        </div>

        {/* step 영역 */}
        <div className="flex-1">
          {/* Step 1 */}
          <div
            className={`mb-4 rounded-md ${
              currentStep === 1 ? "bg-white dark:bg-[#353E5C] shadow" : ""
            }`}>
            <div className={"px-[10px] py-4"}>
              <p
                className={`${
                  currentStep === 1
                    ? "text-[#19213D] dark:text-[#EDF0F4] text-sm font-samsung400"
                    : "text-primary-gray dark:text-[#737E8F] text-sm font-samsung400"
                }`}>
                <span>Step 1</span>
                <span className="mx-2">특허 분류 체계 준비</span>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`mb-4 rounded-md ${
              currentStep === 2 ? "bg-white dark:bg-[#353E5C] shadow" : ""
            }`}>
            <div className={`px-[10px] py-4`}>
              <p
                className={`${
                  currentStep === 2
                    ? "text-[#19213D] dark:text-[#EDF0F4] text-sm font-samsung400 "
                    : "text-primary-gray dark:text-[#737E8F] text-sm font-samsung400"
                }`}>
                <span>Step 2</span>
                <span className="mx-2">특허 분류 체계 수정</span>
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`mb-4 rounded-md ${
              currentStep === 3 ? "bg-white dark:bg-[#353E5C] shadow" : ""
            }`}>
            <div className={`px-[10px] py-4`}>
              <p
                className={`${
                  currentStep === 3
                    ? "text-[#19213D] dark:text-[#EDF0F4] text-sm font-samsung400"
                    : "text-primary-gray dark:text-[#737E8F] text-sm font-samsung400"
                }`}>
                <span>Step 3</span>
                <span className="mx-2">특허 데이터 분류</span>
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div
            className={`mb-4 rounded-md ${
              currentStep === 4 ? "bg-white dark:bg-[#353E5C] shadow" : ""
            }`}>
            <div className={`pl-[10px] py-4`}>
              <p
                className={`${
                  currentStep === 4
                    ? "text-[#19213D] dark:text-[#EDF0F4] text-sm font-samsung400"
                    : "text-primary-gray dark:text-[#737E8F] text-sm font-samsung400"
                }`}>
                <span>Step 4</span>
                <span className="mx-2">특허 데이터 분류 결과</span>
              </p>
            </div>
          </div>

          {/* Step 5 (Admin 모드) */}
          {isAdminMode && (
            <div
              className={`mb-4 rounded-md ${
                currentStep === 5 ? "bg-white dark:bg-[#353E5C] shadow" : ""
              }`}>
              <div className={`px-[10px] py-4`}>
                <p
                  className={`${
                    currentStep === 5
                      ? "text-[#19213D] dark:text-[#EDF0F4] text-sm font-samsung400"
                      : "text-primary-gray dark:text-[#737E8F] text-sm font-samsung400"
                  }`}>
                  {/* Step 5 성능 비교 및 최적 모델 선택 */}
                  <span>Step 5</span>
                  <span className="mx-2">최적 모델 선택</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 하단 영역 */}
        <div className="mt-auto">
          {/* 다크모드 토글 */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center">
              <Moon className="h- w-3 text-primary-gray dark:text-gray-400 mr-2" />
              <span className="text-primary-gray dark:text-gray-400 text-xs font-samsung400">
                Dark mode
              </span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="darkModeToggle"
                className="sr-only"
                checked={isDarkMode}
                onChange={handleDarkModeToggle}
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors duration-200 ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-300"
                }`}
                onClick={handleDarkModeToggle}></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 transform ${
                  isDarkMode ? "translate-x-6" : "translate-x-0"
                }`}
                onClick={handleDarkModeToggle}></div>
            </div>
          </div>

          {/* 새 특허 시작 버튼 */}
          <Button
            onClick={handleStartNewPatent}
            icon={<Plus className="h-5 w-5" />}
            size="lg"
            className="!text-sm">
            Start new patent
          </Button>
        </div>
      </div>

      {/* 확인 모달 */}
      <NextModal
        isOpen={isModalOpen}
        title="새로운 특허 프로세스를 시작하시겠습니까?"
        description="현재 진행 중인 모든 작업이 초기화됩니다."
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </>
  );
};

export default SideBar;