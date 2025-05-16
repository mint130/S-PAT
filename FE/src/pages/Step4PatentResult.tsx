import { useState, useEffect } from "react";
import Title from "../components/common/Title";
import patentColumnsStep4 from "../components/Step4/patentColumsStep4";
import DataTable from "../components/common/dataTable/DataTable";
import { fetchPatentClassifications, Patent } from "../apis/userApi";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "../components/common/Button";
import useThemeStore from "../stores/useThemeStore";

function Step4PatentResult() {
  const [colDefs] = useState(patentColumnsStep4);
  const [patentData, setPatentData] = useState<Patent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useThemeStore(); // 다크모드 상태 가져오기

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchPatentClassifications();
      setPatentData(response.patents);
    } catch (err) {
      console.error("특허 데이터를 가져오는 중 오류 발생:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full p-8">
      <Title
        text="특허 데이터 분류 결과"
        subText="특허 분류 체계를 기준으로 설정된 최적 LLM 모델을 통해 특허 데이터 분류 결과를 확인하실 수 있습니다"
      />

      {error ? (
        <div className="flex-1 h-full flex flex-col items-center justify-center">
          <div className="flex items-center text-red-500 mb-4">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
          <Button
            variant={isDarkMode ? "dark-outline" : "outline"}
            size="sm"
            isLoading={loading}
            icon={<RefreshCw size={17} />}
            onClick={fetchData}>
            다시 시도하기
          </Button>
        </div>
      ) : (
        <DataTable
          colDefs={colDefs}
          rowData={patentData}
          download={true}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Step4PatentResult;
