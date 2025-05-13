import React, { useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import Button from "../common/Button";
import useThemeStore from "../../stores/useThemeStore";

interface PromptProps {
  onSubmit?: (promptText: string) => void;
  isLoading?: boolean;
  onFileProcessed?: (file: File, buffer: ArrayBuffer) => void;
}

const Prompt: React.FC<PromptProps> = ({
  onSubmit,
  isLoading = false,
  onFileProcessed,
}) => {
  const [promptText, setPromptText] = useState<string>("");
  const { isDarkMode } = useThemeStore();

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supportedFormats = ["CSV", "XLSX"];

  const formatString = supportedFormats.join(", ");

  // 파일 업로드 처리 함수
  const handleFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toUpperCase();
    if (extension && supportedFormats.includes(extension)) {
      setFileLoading(true);

      // 파일 읽기 객체 생성
      const reader = new FileReader();

      // 파일 읽기 완료 시 함수
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // target이 null이 아닌지 확인
        if (e.target && e.target.result && onFileProcessed) {
          const fileReader = e.target as FileReader;
          // result가 존재하는지 확인
          if (fileReader.result) {
            setTimeout(() => {
              // 파일과 버퍼 데이터 부모 컴포넌트로 전달
              onFileProcessed(file, fileReader.result as ArrayBuffer);
              setFileLoading(false);
            }, 1000);
          } else {
            setFileLoading(false);
          }
        } else {
          setFileLoading(false);
        }
      };

      // 파일 읽기 중 오류 시
      reader.onerror = () => {
        alert("파일을 읽는 중 오류가 발생했습니다.");
        setFileLoading(false);
      };

      // 파일 읽기 시작
      reader.readAsArrayBuffer(file);
    } else {
      alert(`지원하는 파일 형식만 업로드 가능합니다: ${formatString}`);
    }
  };

  // 파일 입력 처리 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // 드래그 이벤트 핸들러
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // 드롭 이벤트 핸들러
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 텍스트 입력 핸들러
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value);
  };

  const handleSubmit = () => {
    if (!promptText.trim() || isLoading) return; // isLoading이 true면 제출 못하게

    if (onSubmit) {
      onSubmit(promptText);
      setPromptText(""); // 텍스트 입력 필드 비우기
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`bg-white dark:bg-[#23283D]  rounded-xl shadow-sm p-4 sm:py-4 sm:px-5 overflow-hidden
          ${dragActive ? "border-2 border-blue-500 bg-blue-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}>
        <textarea
          className={`w-full min-h-[60px] rounded-lg focus:outline-none resize-none text-gray-700 dark:text-[#ACB4C0] dark:bg-[#23283D] font-samsung400 text-sm break-words ${
            isLoading || fileLoading ? "cursor-not-allowed" : ""
          }`}
          placeholder="특허 분류 체계를 생성하기 위한 프롬프트를 입력해주세요"
          value={promptText}
          onChange={handlePromptChange}
          disabled={isLoading || fileLoading}
        />

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv,.xlsx"
          onChange={handleChange}
        />

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Button
            variant={isDarkMode ? "dark-outline" : "outline"}
            icon={<Paperclip className="h-4 w-4" />}
            size="sm"
            textSize="xs"
            disabled={isLoading || fileLoading}
            onClick={handleButtonClick}>
            {fileLoading ? "업로드 중..." : "Upload"}
          </Button>

          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            icon={<Send className="h-4 w-4" />}
            size="sm"
            disabled={
              promptText.trim() === "" || isLoading || fileLoading
            }></Button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
