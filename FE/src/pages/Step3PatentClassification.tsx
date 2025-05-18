import { useState } from "react";
import axios from "axios";
import Title from "../components/common/Title";
import PatentFileUpload from "../components/Step3/PatentFileUpload";
import PatentTable from "../components/Step3/PatentTable";
import Button from "../components/common/Button";
import NextModal from "../components/common/NextModal";
import UserLoading from "../components/Loading/UserLoading";
import MultiAILoadingScreen from "../components/Loading/MultiAILoadingScreen";

function Step3PatentClassification() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [fileLength, setFileLength] = useState<number>(0);

  // 파일 처리 완료 핸들러
  const handleFileProcessed = (file: File, buffer: ArrayBuffer) => {
    setUploadedFile(file);
    setFileBuffer(buffer);
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

  // 파일 다시 선택하기 핸들러 추가
  const handleReselect = () => {
    setUploadedFile(null);
    setFileBuffer(null);
    setFileLength(0);
  };

  const saveBestLLM = async () => {
    try {
      const response = await axios.get("https://s-pat.site/api/user/LLM");
      localStorage.setItem("LLM", response.data.LLM);
      console.log("Best LLM saved successfully:", response.data.LLM);
    } catch (error) {
      console.error("Error saving best LLM:", error);
    }
  };

  // 모달 확인 버튼 클릭 시 API 호출 및 로딩 화면으로 전환
  const onConfirm = async () => {
    if (!uploadedFile) return;
    setLoading(true);
    setModalOpen(false);

    try {
      // LLM 정보 먼저 저장
      await saveBestLLM();

      const session_id = localStorage.getItem("sessionId");
      const llm = localStorage.getItem("LLM");

      if (!session_id) {
        throw new Error("세션 ID를 찾을 수 없습니다.");
      }

      console.log("LLM:", llm);

      // 세션 ID 설정
      setSessionId(session_id);

      // FormData 객체 생성
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const Role = localStorage.getItem("role");

      if (Role === "User") {
        // 분류 작업 시작 API 호출
        const response = await axios.post(
          `https://s-pat.site/api/user/${session_id}/upload?LLM=${llm}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // 성공응답
        console.log("분류 작업 시작 API 응답:", response.data);
        setIsClassifying(true);
      } else {
        // 분류 작업 시작 API 호출
        const response = await axios.post(
          `https://s-pat.site/api/admin/${session_id}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // 성공응답
        console.log("분류 작업 시작 API 응답:", response.data);

        // Admin인 경우 MultiAILoadingScreen 표시
        setIsClassifying(true);
      }
      // 실패응답
    } catch (err) {
      console.error("API 오류:", err);
      setIsClassifying(false);
      setLoading(false);
      alert(
        "특허 분류 작업을 시작하는 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  return (
    <div className="p-8 pb-6 h-full flex flex-col justify-stretch grow">
      {isClassifying ? (
        localStorage.getItem("role") === "Admin" ? (
          <MultiAILoadingScreen sessionId={sessionId} fileLength={fileLength}/>
        ) : (
          <UserLoading sessionId={sessionId} fileLength={fileLength} />
        )
      ) : (
        <>
          <Title
            text="분류 데이터 분류"
            subText="분류할 특허 데이터 파일을 업로드해주세요. 이전 단계에서 설정한 분류체계에 따라 AI가 자동으로 특허를 분류합니다."
          />

          {!uploadedFile || !fileBuffer ? (
            <PatentFileUpload onFileProcessed={handleFileProcessed} />
          ) : (
            <PatentTable
              fileBuffer={fileBuffer}
              setfileLength={setFileLength}
            />
          )}

          {/* 이전/다음 버튼 영역 */}
          <div className="flex justify-end w-full mt-7 space-x-6">
            {uploadedFile && (
              <button
                className="font-pretendard text-primary-blue hover:text-blue-800"
                onClick={handleReselect}>
                다시 선택하기
              </button>
            )}
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
        </>
      )}
    </div>
  );
}

export default Step3PatentClassification;
