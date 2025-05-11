import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Title from "../components/common/Title";
import PatentFileUpload from "../components/Step3/PatentFileUpload";
import PatentTable from "../components/Step3/PatentTable";
import Button from "../components/common/Button";
import NextModal from "../components/common/NextModal";

function Step3PatentClassification() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // 파일 처리 완료 핸들러
  const handleFileProcessed = (file: File, buffer: ArrayBuffer) => {
    setUploadedFile(file);
    setFileBuffer(buffer);
  };

  // 이전 단계로 이동
  const handlePrevious = () => {
    navigate("/user/step2");
  };

  // 다음 버튼 클릭 시 모달 열기
  const handleNext = () => {
    if (!uploadedFile) return;
    setModalOpen(true);
  };

  // 모달 취소 버튼 클릭 시 모달 닫기
  const onCancel = () => {
    setModalOpen(false);
  };

  // 모달 확인 버튼 클릭 시 API 호출
  const onConfirm = async () => {
    if (!uploadedFile) return;
    setLoading(true);

    try {
      const session_id = localStorage.getItem("sessionId");

      if (!session_id) {
        throw new Error("세션 ID를 찾을 수 없습니다.");
      }

      // FormData 객체 생성
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await axios.post(
        `https://s-pat.site/api/user/${session_id}/classification`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API 응답:", response.data);

      // 성공적으로 처리된 후 다음 단계로 이동
      navigate("/user/step4", {
        state: {
          patentResult: response.data.patents,
        },
      });
    } catch (err) {
      console.error("API 오류:", err);
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
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
        <PatentTable fileBuffer={fileBuffer} />
      )}

      {/* 이전/다음 버튼 영역 */}
      <div className="flex justify-between w-full mt-10">
        <Button
          variant="outline"
          size="md"
          className="w-24"
          onClick={handlePrevious}
          disabled={loading}>
          이전
        </Button>
        <Button
          variant="primary"
          size="md"
          className="w-24"
          disabled={!uploadedFile || !fileBuffer}
          isLoading={loading}
          onClick={handleNext}>
          다음
        </Button>
      </div>

      {/* 다음 모달 */}
      <NextModal
        isOpen={modalOpen}
        title="해당 특허데이터로 분류를 진행하시겠습니까?"  
        description="진행하기 버튼을 누르면 AI가 분류를 시작합니다."
        onCancel={onCancel}
        onConfirm={onConfirm}
        isLoading={loading}
      />
    </div>
  );
}

export default Step3PatentClassification;
