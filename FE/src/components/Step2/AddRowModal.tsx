// AddRowModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../common/Button";

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRow: (rowData: Record<string, any>) => void;
}

const AddRowModal: React.FC<AddRowModalProps> = ({
  isOpen,
  onClose,
  onAddRow,
}) => {
  const [formData, setFormData] = useState({
    code: "", // 분류코드
    level: "", // 분류단계
    name: "", // 명칭
    description: "", // 상세설명
  });

  const [errors, setErrors] = useState({
    code: false,
    level: false,
    name: false,
    description: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 값이 입력되면 해당 필드의 에러 상태 제거
    if (value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSubmit = () => {
    // 필드 유효성 검사
    const newErrors = {
      code: formData.code.trim() === "",
      level: formData.level.trim() === "",
      name: formData.name.trim() === "",
      description: formData.description.trim() === "",
    };

    setErrors(newErrors);

    // 모든 필드가 입력되었는지 확인
    if (Object.values(newErrors).some((error) => error)) {
      return; // 하나라도 비어있으면 제출하지 않음
    }

    // 모든 값이 입력되었으면 새 행 추가
    onAddRow(formData);

    // 폼 초기화
    setFormData({
      code: "",
      level: "",
      name: "",
      description: "",
    });

    // 모달 닫기
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#23283D] rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium dark:text-[#A7ACB4]">
            새 항목 추가
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A7ACB4] mb-1">
                분류코드 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4] ${
                  errors.code ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">
                  분류코드를 입력해주세요
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A7ACB4] mb-1">
                분류단계 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4] ${
                  errors.level ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.level && (
                <p className="text-red-500 text-xs mt-1">
                  분류단계를 입력해주세요
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A7ACB4] mb-1">
                명칭 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4] ${
                  errors.name ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">명칭을 입력해주세요</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A7ACB4] mb-1">
                상세설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4] ${
                  errors.description ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  상세설명을 입력해주세요
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700">
          <Button onClick={onClose} variant="outline" size="sm">
            취소
          </Button>
          <Button onClick={handleSubmit} size="sm">
            추가
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddRowModal;
