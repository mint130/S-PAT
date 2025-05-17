import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "../common/dataTable/DataTable";
import type { ColDef } from "ag-grid-community";

interface PatentTableProps {
  // file: File;
  fileBuffer: ArrayBuffer;
  setfileLength: (length: number) => void;
}

const PatentTable: React.FC<PatentTableProps> = ({
  fileBuffer,
  setfileLength,
}) => {
  const [patentData, setPatentData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef<any, any>[]>([]);

  useEffect(() => {
    // 파일 데이터 처리
    const processFileData = async () => {
      try {
        // XLSX 라이브러리를 사용하여 파일 파싱
        const workbook = XLSX.read(fileBuffer, { type: "array" });

        // 첫 번째 시트 데이터 가져오기
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 시트 데이터를 JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setfileLength(jsonData.length);

        // JSON 데이터 상태에 저장
        setPatentData(jsonData);
        console.log("파일에서 읽은 데이터:", jsonData);
      } catch (err) {
        console.error("step3 파일 처리 중 오류 발생:", err);
      }
    };

    if (fileBuffer) {
      processFileData();
    }
  }, [fileBuffer]);

  useEffect(() => {
    // patentData가 있을 때 colDefs 생성
    if (patentData.length > 0) {
      const keys = Object.keys(patentData[0]);
      const generatedColDefs = keys.map((key) => ({
        field: key,
        headerName: key,
        minWidth: 100,
      }));
      setColDefs(generatedColDefs);
    }
  }, [patentData]);

  return (
    <>
      <DataTable rowData={patentData} colDefs={colDefs} />
    </>
  );
};

export default PatentTable;
