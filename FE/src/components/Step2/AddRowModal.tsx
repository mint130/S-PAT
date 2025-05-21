// AddRowModal.tsx
import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import Button from "../common/Button";

interface CodesByLevel {
  대분류: string[];
  중분류: string[];
  소분류: string[];
}

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRow: (rowData: Record<string, any>) => void;
  codesByLevel: CodesByLevel;
}

const AddRowModal: React.FC<AddRowModalProps> = ({
  isOpen,
  onClose,
  onAddRow,
  codesByLevel,
}) => {
  const [formData, setFormData] = useState({
    code: "", // 분류코드
    level: "", // 분류단계
    name: "", // 명칭
    description: "", // 상세설명
  });

  const [selectedParentCode, setSelectedParentCode] = useState("");
  const [codeSuffix, setCodeSuffix] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);

  // 코드 중복 확인을 위한 모든 코드 목록 생성
  const allCodes = [
    ...codesByLevel.대분류,
    ...codesByLevel.중분류,
    ...codesByLevel.소분류,
  ];

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때는 초기화하지 않음
    } else {
      // 모달이 닫힐 때 상태 초기화
      resetForm();
    }
  }, [isOpen]);

  // 분류단계 변경 시 관련 상태 초기화
  useEffect(() => {
    if (formData.level === "") {
      setFormData((prev) => ({ ...prev, code: "" }));
      setSelectedParentCode("");
      setCodeSuffix("");
      setDuplicateError(false);
    }
  }, [formData.level]);

  // 상위 코드나 하위 코드가 변경될 때 코드 필드 업데이트 및 중복 검사
  useEffect(() => {
    let fullCode = "";

    if (formData.level === "대분류") {
      fullCode = codeSuffix;
    } else if (selectedParentCode && codeSuffix) {
      fullCode = `${selectedParentCode}-${codeSuffix}`;
    }

    // 코드가 있을 때만 중복 검사
    if (fullCode) {
      const isDuplicate = allCodes.includes(fullCode);
      setDuplicateError(isDuplicate);
    } else {
      setDuplicateError(false);
    }

    setFormData((prev) => ({
      ...prev,
      code: fullCode,
    }));
  }, [selectedParentCode, codeSuffix, formData.level, codesByLevel]);

  // 폼 초기화 함수
  const resetForm = () => {
    setFormData({
      code: "",
      level: "",
      name: "",
      description: "",
    });
    setSelectedParentCode("");
    setCodeSuffix("");
    setDuplicateError(false);
  };

  // 폼 유효성 검사 - 모든 필수 필드가 채워졌는지 확인 및 중복 검사
  const isFormValid = () => {
    return (
      formData.code.trim() !== "" &&
      formData.level.trim() !== "" &&
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      !duplicateError
    );
  };

  // 기본 입력 필드 변경 핸들러 (명칭, 상세설명)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 분류단계 변경 핸들러
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value;

    // 분류단계 변경 시 관련 필드 초기화
    setFormData((prev) => ({
      ...prev,
      level,
      code: "", // 코드 초기화
    }));

    // 상위 코드 상태 초기화
    setSelectedParentCode("");
    setCodeSuffix("");
    setDuplicateError(false);
  };

  // 상위 코드 선택 핸들러
  const handleParentCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedParentCode(code);
  };

  // 하위 코드 입력 핸들러
  const handleCodeSuffixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const suffix = e.target.value;
    setCodeSuffix(suffix);
  };

  // 대분류 코드 직접 입력 핸들러
  const handleMainCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setCodeSuffix(code);
  };

  // 모달 닫기 핸들러 - 상태 초기화 후 닫기
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    // 폼이 유효하지 않으면 제출하지 않음
    if (!isFormValid()) {
      return;
    }

    // 코드 중복 확인
    if (duplicateError) {
      return; // 중복된 코드면 제출하지 않음
    }

    // 모든 값이 입력되었으면 새 행 추가
    onAddRow(formData);

    // 폼 초기화
    resetForm();

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
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {/* 분류단계 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A7ACB4] mb-1">
                분류단계 <span className="text-red-500">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleLevelChange}
                className="w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4]">
                <option value="">선택하세요</option>
                <option value="대분류">대분류</option>
                <option value="중분류">중분류</option>
                <option value="소분류">소분류</option>
              </select>
            </div>

            {/* 분류코드 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A7ACB4] mb-1">
                분류코드 <span className="text-red-500">*</span>
              </label>

              {/* 분류단계 미선택 시 */}
              {!formData.level && (
                <input
                  type="text"
                  disabled={true}
                  placeholder="분류단계를 먼저 선택해주세요"
                  className="w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4] bg-gray-100 dark:bg-gray-700"
                />
              )}

              {/* 대분류 선택 시 */}
              {formData.level === "대분류" && (
                <div>
                  <input
                    type="text"
                    value={codeSuffix}
                    onChange={handleMainCodeChange}
                    placeholder="대분류 코드 입력"
                    className={`w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4] ${
                      duplicateError ? "border-red-500 dark:border-red-500" : ""
                    }`}
                  />
                  {duplicateError && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle size={12} />
                      <span>
                        이미 존재하는 코드입니다. 다른 코드를 입력해주세요.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 중분류 선택 시 */}
              {formData.level === "중분류" && (
                <div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedParentCode}
                      onChange={handleParentCodeChange}
                      className="w-1/2 p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4]">
                      <option value="">대분류 선택</option>
                      {codesByLevel.대분류.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>

                    {/* 하이픈 구분자 */}
                    <div className="text-gray-500 dark:text-gray-400 font-bold">
                      -
                    </div>

                    {/* 하위코드 입력 필드 */}
                    <input
                      type="text"
                      value={codeSuffix}
                      onChange={handleCodeSuffixChange}
                      placeholder={
                        selectedParentCode
                          ? "하위 코드 입력"
                          : "대분류를 먼저 선택해주세요"
                      }
                      disabled={!selectedParentCode}
                      className={`flex-1 p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4] ${
                        duplicateError
                          ? "border-red-500 dark:border-red-500"
                          : ""
                      } ${
                        !selectedParentCode
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }`}
                    />
                  </div>
                  {duplicateError && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle size={12} />
                      <span>
                        이미 존재하는 코드입니다. 다른 코드를 입력해주세요.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 소분류 선택 시 */}
              {formData.level === "소분류" && (
                <div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedParentCode}
                      onChange={handleParentCodeChange}
                      className="w-1/2 p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4]">
                      <option value="">중분류 선택</option>
                      {codesByLevel.중분류.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>

                    {/* 하이픈 구분자 */}
                    <div className="text-gray-500 dark:text-gray-400 font-bold">
                      -
                    </div>

                    {/* 하위코드 입력 필드 */}
                    <input
                      type="text"
                      value={codeSuffix}
                      onChange={handleCodeSuffixChange}
                      placeholder={
                        selectedParentCode
                          ? "하위 코드 입력"
                          : "중분류를 먼저 선택해주세요"
                      }
                      disabled={!selectedParentCode}
                      className={`flex-1 p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4] ${
                        duplicateError
                          ? "border-red-500 dark:border-red-500"
                          : ""
                      } ${
                        !selectedParentCode
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }`}
                    />
                  </div>
                  {duplicateError && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                      <AlertCircle size={12} />
                      <span>
                        이미 존재하는 코드입니다. 다른 코드를 입력해주세요.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 명칭 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A7ACB4] mb-1">
                명칭 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4]"
              />
            </div>

            {/* 상세설명 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#A7ACB4] mb-1">
                상세설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded-md dark:bg-[#1F2437] dark:border-gray-700 dark:text-[#A7ACB4]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700">
          <Button onClick={handleClose} variant="outline" size="sm">
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid()} size="sm">
            추가
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddRowModal;
