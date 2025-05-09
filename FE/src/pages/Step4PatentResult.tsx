import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/common/Title";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";

function Step4PatentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const { patentResult } = location.state || [];

  useEffect(() => {
    console.log(patentResult);
    if (!patentResult) {
      navigate("/user/step3");
    }
  }, [patentResult, navigate]);

  const handlePrevious = () => {
    navigate("/user/step3");
  };

  return (
    <div className="flex flex-col h-screen p-8 pb-6">
      <Title text="특허 데이터분류 결과" subText="" />

      <DataTable data={patentResult} fileName="분류된 결과" />

      {/* 이전/다음 버튼 영역 */}
      <div className="flex justify-between w-full mt-10">
        <Button
          variant="outline"
          size="md"
          className="w-24"
          onClick={handlePrevious}>
          이전
        </Button>
        <Button variant="primary" size="md" className="w-24">
          종료
        </Button>
      </div>
    </div>
  );
}

export default Step4PatentResult;
