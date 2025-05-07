import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/common/Title";

function Step2ClassificationEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedStandards } = location.state || {};

  console.log("selectedStandards", selectedStandards);

  useEffect(() => {
    if (!selectedStandards) {
      navigate("/user/step1");
    }
  }, [selectedStandards, navigate]);

  return (
    <div className="flex flex-col h-screen p-8 pb-6">
      <Title
        text="분류 체계 수정"
        subText="Step1에서 생성된 분류 체계를 수정하세요. 테이블을 직접 편집하거나 필요에 따라 항목을 추가/삭제할 수 있습니다."
      />
      {selectedStandards[0].description}
    </div>
  );
}

export default Step2ClassificationEdit;
