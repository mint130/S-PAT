import { useState, useEffect } from "react";
import Title from "../components/common/Title";
import patentColumnsStep4 from "../components/Step4/patentColumsStep4";
import DataTable from "../components/common/dataTable/DataTable";
import {
  fetchPatentClassifications,
  Patent,
  fetchPatentClassificationsExcel,
} from "../apis/userApi";
import { AlertCircle, RefreshCw, Download } from "lucide-react";
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

  // 엑셀 다운로드 핸들러 함수
  const handleExcelDownload = async () => {
    try {
      // API를 통해 엑셀 파일 데이터 가져오기
      const blobData = await fetchPatentClassificationsExcel();
      // Blob URL 생성
      const url = window.URL.createObjectURL(new Blob([blobData]));

      // 현재 날짜를 YYMMDD 형식으로 포맷팅
      const now = new Date();
      const dateStr = now
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "")
        .substring(2);

      // 다운로드 링크 생성 및 설정
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `특허 데이터 분류 결과_${dateStr}.xlsx`);

      // 다운로드 실행
      document.body.appendChild(link);
      link.click();

      // 리소스 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("엑셀 다운로드 중 오류 발생:", err);
      alert("엑셀 다운로드 중 오류가 발생했습니다.");
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
          handleExcelDownload={handleExcelDownload}
        />
      )}
    </div>
  );
}

export default Step4PatentResult;
