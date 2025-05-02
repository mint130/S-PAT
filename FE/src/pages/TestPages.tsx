import { Camera } from "lucide-react";
import Title from "../components/common/Title";
import Button from "../components/common/Button";

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

      {/* Button 사용예시 */}
      <div className="w-full flex gap-2 items-center justify-center ">
        <Button>다음</Button>
        <Button variant="outline">이전</Button>
        <Button disabled={true}>비활성화</Button>
        <Button isLoading={true}>로딩</Button>
        <Button size="sm" textSize="xs">
          사이즈
        </Button>
        <Button size="lg" onClick={() => alert("버튼이 클릭되었습니다!")}>
          클릭
        </Button>
        {/* 복합 예시 
        <Button
          isLoading={isSubmitting}
          disabled={!isFormValid}
          onClick={handleSubmit}>
          제출하기
        </Button> */}
      </div>
    </>
  );
}

export default TestPages;
