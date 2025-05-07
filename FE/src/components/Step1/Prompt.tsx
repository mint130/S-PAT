import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import Button from "../common/Button";

interface PromptProps {
  onSubmit?: (promptText: string) => void;
  isLoading?: boolean;
}

const Prompt: React.FC<PromptProps> = ({ onSubmit, isLoading = false }) => {
  const [promptText, setPromptText] = useState<string>("");

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
      <div className="bg-white rounded-xl shadow-sm p-4 sm:py-4 sm:px-5 overflow-hidden">
        <textarea
          className={`w-full min-h-[60px] rounded-lg focus:outline-none resize-none text-gray-700 font-samsung400 text-subtitle break-words ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
          placeholder="특허 분류 체계를 생성하기 위한 프롬프트를 입력해주세요"
          value={promptText}
          onChange={handlePromptChange}
          disabled={isLoading}
        />

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Button
            variant="outline"
            icon={<Paperclip className="h-4 w-4" />}
            size="sm"
            textSize="xs"
            disabled={isLoading}>
            Upload
          </Button>

          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            icon={<Send className="h-4 w-4" />}
            size="sm"
            disabled={promptText.trim() === "" || isLoading}></Button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
