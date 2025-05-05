import Title from "../components/common/Title";

function Step3PatentClassification() {
  return (
    <div className="p-8 pb-6 flex flex-col justify-stretch grow">
      <Title
        text="분류 데이터 분류"
        subText="분류할 특허 데이터 파일을 업로드해주세요. 이전 단계에서 설정한 분류체계에 따라 AI가 자동으로 특허를 분류합니다."
      />
    </div>
  );
}

export default Step3PatentClassification;
