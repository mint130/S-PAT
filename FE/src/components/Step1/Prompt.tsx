import React, { useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import Button from "../common/Button";
import useThemeStore from "../../stores/useThemeStore";

interface PromptProps {
  onSubmit?: (promptText: string) => void;
  isLoading?: boolean;
  onFileProcessed?: (file: File, buffer: ArrayBuffer) => void;
  showFileUpload?: boolean; // 파일 업로드 버튼 표시 여부
}

const Prompt: React.FC<PromptProps> = ({
  onSubmit,
  isLoading = false,
  onFileProcessed,
  showFileUpload = true, // 기본값은 true
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
    if (isLoading || fileLoading) return; // 로딩 중일 때 파일 처리 막기
    
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
      // 파일 input의 value를 초기화하여 같은 파일도 다시 선택 가능하게 함
      e.target.value = "";
    }
  };

  // 드래그 이벤트 핸들러
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // isLoading 또는 fileLoading 상태일 때는 드래그 효과 비활성화
    if (isLoading || fileLoading) return;

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
    
    // isLoading 또는 fileLoading 상태일 때는 파일 드롭 처리 막기
    if (isLoading || fileLoading) return;

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

  // 키보드 이벤트 핸들러 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 키를 눌렀고 Shift 키를 누르지 않았을 때 제출
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 기본 줄바꿈 동작 방지
      handleSubmit();
    }
    // Shift + Enter는 기본 동작(줄바꿈) 그대로 허용
  };

  const handleSubmit = () => {
    if (!promptText.trim() || isLoading || fileLoading) return; // isLoading이나 fileLoading이 true면 제출 못하게

    if (onSubmit) {
      onSubmit(promptText);
      setPromptText(""); // 텍스트 입력 필드 비우기
    }
  };

  return (
    <div className="flex flex-col ">
      <div
        className={`bg-white dark:bg-[#23283D] rounded-xl shadow-sm p-4 sm:py-4 sm:px-5 overflow-hidden
          ${dragActive && !isLoading && !fileLoading ? "border-2 border-blue-500 bg-blue-50" : ""}
          ${isLoading || fileLoading ? "cursor-not-allowed" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}>
        <textarea
          className={`w-full min-h-[60px] rounded-lg focus:outline-none resize-none text-gray-700 dark:text-[#A7ACB4] dark:bg-[#23283D] font-pretendard text-md break-words bg-white disabled:bg-white disabled:text-gray-700 ${
            isLoading || fileLoading ? "cursor-not-allowed" : ""
          }`}
          placeholder="ex) 휴머노이드 특허데이터에 대한 분류 체계를 생성해줘"
          value={promptText}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading || fileLoading}
        />

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv,.xlsx"
          onChange={handleChange}
          disabled={isLoading || fileLoading} // 파일 입력도 비활성화
        />

        <div className="flex flex-col sm:flex-row gap-2">
          {showFileUpload && (
            <Button
              variant={isDarkMode ? "dark-outline" : "outline"}
              icon={<Paperclip className="h-4 w-4" />}
              size="sm"
              textSize="xs"
              disabled={isLoading || fileLoading}
              onClick={handleButtonClick}>
              {fileLoading ? "업로드 중..." : "Upload"}
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            // isLoading={isLoading}
            icon={<Send className="h-4 w-4" />}
            size="sm"
            className="ml-auto"
            disabled={
              promptText.trim() === "" || isLoading || fileLoading
            }></Button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;