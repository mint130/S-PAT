import Title from "../components/common/Title";
import ChatContent from "../components/Step1/ChatContent";

function Step1ClassificationSetup() {
  return (
    <div className="flex flex-col h-screen p-8 pb-6">
      <Title
        text="분류 체계 준비"
        subText="특허 분류를 위해 맞춤형 분류 체계를 AI로 생성하거나 기존 체계 파일을 업로드하세요."
      />

      <ChatContent />
    </div>
  );
}

export default Step1ClassificationSetup;
