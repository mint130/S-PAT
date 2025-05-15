// components/common/SuccessModal.tsx
import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  subTitle?: string;
  buttonText?: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title,
  subTitle,
  buttonText = "처음으로",
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999]">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      />

      {/* 모달 내용 */}
      <div className="bg-white dark:bg-[#2A2F3F] rounded-2xl p-12 z-10 mx-4 text-center shadow-xl max-w-md w-full transition-colors duration-200">
        {/* 체크 아이콘 */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-pretendard font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>

        {/* 부제목 */}
        {subTitle && (
          <p className="text-gray-600 dark:text-gray-300 mb-8">{subTitle}</p>
        )}

        {/* 버튼 */}
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-pretendard font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
