import Title from "../components/common/Title";
import IntroContent from "../components/Step1/IntroContent";
import Prompt from "../components/Step1/Prompt";

function Step1ClassificationSetup() {
  return (
    <div className="p-8 pb-6 flex flex-col justify-stretch grow">
      <Title
        text="분류 체계 준비"
        subText="특허 분류를 위해 맞춤형 분류 체계를 AI로 생성하거나 기존 체계 파일을 업로드하세요."
      />
      <IntroContent />
      <Prompt />
    </div>
  );
}

export default Step1ClassificationSetup;
