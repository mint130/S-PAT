import { AlertCircle } from "lucide-react";
import Button from "./Button";

interface WarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

function WarningModal({ isOpen, onConfirm }: WarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center mb-4">
            <div className=" rounded-full p-2">
              <AlertCircle className="text-gray-700 w-6 h-6 dark:text-gray-300" />
            </div>
            <h2 className="text-lg font-medium text-orange-800 dark:text-orange-400">
              분류체계 수정 주의사항
            </h2>
          </div>

          {/* 본문 */}
          <div className="mb-6">
            <p className="text-gray-800 dark:text-gray-200 mb-4">
              분류체계 변경은 이후 특허 분류 결과에 직접적인 영향을 미치며,
              수정으로 인한 분류 결과에 대한 책임은 사용자에게 있습니다.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4">
              <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                분류체계 구조 안내
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                대분류, 중분류, 소분류는 서로 연결되어 있으니 수정 시 분류 간
                일관성을 유지해주세요.
              </p>
            </div>
            <p className="text-red-600 dark:text-red-400 mt-8 font-medium">
              ※ 새로고침 시 수정사항이 사라집니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end">
            <Button
              onClick={onConfirm}
              size="sm"
              variant="primary"
              className="ml-auto">
              이해했습니다, 계속하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;
