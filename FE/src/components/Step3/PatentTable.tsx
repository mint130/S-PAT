import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface PatentTableProps {
  file: File;
  fileBuffer: ArrayBuffer;
}

const PatentTable: React.FC<PatentTableProps> = ({ file, fileBuffer }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        // 콘솔에 데이터 출력
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
  }, [file, fileBuffer]);

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

  // 파일 처리 완료
  const bufferSize = fileBuffer.byteLength;

  return (
    <div className="flex flex-col w-full h-full pt-8">
      <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white h-96 overflow-auto">
        <div className="mb-4">
          <p>
            <strong>파일명:</strong> {file.name}
          </p>
          <p>
            <strong>파일 크기:</strong> {(bufferSize / 1024).toFixed(2)} KB
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <p>ArrayBuffer가 성공적으로 생성되었습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PatentTable;
