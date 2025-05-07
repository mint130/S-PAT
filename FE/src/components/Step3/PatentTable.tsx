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

  // 로딩 중이라면
  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full pt-8">
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white h-96 flex items-center justify-center">
          <p>파일 데이터를 처리 중입니다...</p>
        </div>
      </div>
    );
  }

  // 오류가 있다면
  if (error) {
    return (
      <div className="flex flex-col w-full h-full pt-8">
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white h-96 overflow-auto">
          <div className="mb-4 text-red-500">
            <p>
              <strong>오류:</strong> {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없다면
  if (patentData.length === 0) {
    return (
      <div className="flex flex-col w-full h-full pt-8">
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white h-96 flex items-center justify-center">
          <p>파일에 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full mt-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white overflow-auto">
      <div className="">
        <p>{file.name}</p>
      </div>

      <DataTable data={patentData} />
    </div>
  );
};

export default PatentTable;
