import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import Button from "../common/Button";

interface PromptProps {
  onSubmit?: (promptText: string) => void;
}

const Prompt: React.FC<PromptProps> = ({ onSubmit }) => {
  const [promptText, setPromptText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value);
  };

  const handleSubmit = () => {
    if (!promptText.trim()) return;

    if (onSubmit) {
      setIsLoading(true);
      onSubmit(promptText);

      // 데모 목적으로 1초 후 로딩 상태를 해제
      setTimeout(() => {
        setIsLoading(false);
        setPromptText("");
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:py-4 sm:px-5 overflow-hidden">
        <textarea
          className="w-full min-h-[60px] rounded-lg focus:outline-none resize-none text-gray-700 font-samsung400 text-subtitle break-words"
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
            textSize="xs">
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
