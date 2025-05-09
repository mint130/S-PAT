import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "../common/DataTable";

interface PatentTableProps {
  file: File;
  fileBuffer: ArrayBuffer;
}

const PatentTable: React.FC<PatentTableProps> = ({ file, fileBuffer }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [patentData, setPatentData] = useState<any[]>([]);

  useEffect(() => {
    // 파일 데이터 처리
    const processFileData = async () => {
      try {
        setIsLoading(true);

        // XLSX 라이브러리를 사용하여 파일 파싱
        const workbook = XLSX.read(fileBuffer, { type: "array" });

        // 첫 번째 시트 데이터 가져오기
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 시트 데이터를 JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // JSON 데이터 상태에 저장
        setPatentData(jsonData);
        console.log("파일에서 읽은 데이터:", jsonData);

        setIsLoading(false);
      } catch (err) {
        console.error("step3 파일 처리 중 오류 발생:", err);
        setError("파일을 처리하는 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    };

    if (fileBuffer) {
      processFileData();
    }
  }, [fileBuffer]);

  return (
    <>
      <DataTable
        data={patentData}
        fileName={file.name}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};

export default PatentTable;
