import { useState } from "react";
import Title from "../components/common/Title";
import PatentFileUpload from "../components/Step3/PatentFileUpload";
import PatentTable from "../components/Step3/PatentTable";
import Button from "../components/common/Button";

function Step3PatentClassification() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);

  // 파일 처리 완료 핸들러
  const handleFileProcessed = (file: File, buffer: ArrayBuffer) => {
    setUploadedFile(file);
    setFileBuffer(buffer);
  };

  return (
    <div className="p-8 pb-6 h-full flex flex-col justify-stretch grow">
      <Title
        text="분류 데이터 분류"
        subText="분류할 특허 데이터 파일을 업로드해주세요. 이전 단계에서 설정한 분류체계에 따라 AI가 자동으로 특허를 분류합니다."
      />

      {!uploadedFile || !fileBuffer ? (
        <PatentFileUpload onFileProcessed={handleFileProcessed} />
      ) : (
        <PatentTable file={uploadedFile} fileBuffer={fileBuffer} />
      )}

      {/* 이전/다음 버튼 영역 */}
      <div className="flex justify-between w-full mt-10">
        <Button variant="outline" size="md" className="w-24">
          이전
        </Button>
        <Button
          variant="primary"
          size="md"
          className="w-24"
          disabled={!uploadedFile || !fileBuffer}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default Step3PatentClassification;
