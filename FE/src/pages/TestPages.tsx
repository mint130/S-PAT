import { Camera } from "lucide-react";
import Title from "../components/common/Title";

function TestPages() {
  return (
    <>
      {/* 예시입니다 */}
      <Title
        text="분류 체계 준비"
        subText="특허 분류를 위해 맞춤형 분류 체계를 AI로 생성하거나 기존 체계 파일을 업로드하세요."
      />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="font-samsungSharp">Samsung Patent AI Technology</h1>
        <Camera color="red" size={48} />
      </div>
    </>
  );
}

export default TestPages;
