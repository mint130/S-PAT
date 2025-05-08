import React from "react";
import Button from "./Button";

interface ConfirmationModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 제목 */
  title: string;
  /** 모달 설명 텍스트 */
  description?: string;
  /** 모달 닫기 핸들러 (취소 버튼 클릭 시) */
  onCancel: () => void;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void;
  /** 로딩 상태 여부 */
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-50"
        onClick={onCancel}></div>

      {/* 모달 내용 */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10">
        {/* 모달 헤더 */}
        <div className="px-4 pt-4 mt-6">
          <h3 className="text-lg font-pretendard font-semibold text-black">
            {title}
          </h3>
        </div>

        {/* 모달 본문 */}
        {description && (
          <div className="px-4 py-2 font-pretendard text-primary-gray">
            <p>{description}</p>
          </div>
        )}

        {/* 모달 푸터 (버튼 영역) */}
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-2">
          <Button variant="outline" size="md" onClick={onCancel}>
            취소
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}>
            진행하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
