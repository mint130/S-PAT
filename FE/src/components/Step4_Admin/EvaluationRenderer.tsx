// EvaluationRenderer.tsx
import React, { useState, useEffect } from "react";
import { ICellRendererParams } from "ag-grid-community";

interface EvaluationButtonProps {
  value: number;
  isSelected: boolean;
  onClick: (value: number) => void;
}

const EvaluationButton: React.FC<EvaluationButtonProps> = ({
  value,
  isSelected,
  onClick,
}) => {
  return (
    <button
      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-pretendard transition-colors
        ${
          isSelected
            ? "border border-primary-blue text-primary-blue bg-primary-blue/10"
            : "border border-gray-400 text-gray-400"
        }`}
      onClick={() => onClick(value)}>
      {value}
    </button>
  );
};

const EvaluationRenderer: React.FC<ICellRendererParams> = (props) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(
    props.value ?? null
  );

  // AG Grid에서 데이터가 변경될 때 상태 업데이트
  useEffect(() => {
    setSelectedValue(props.value ?? null);
  }, [props.value]);

  // 버튼 클릭시 - 같은 값 클릭하면 선택 해제
  const handleClick = (value: number) => {
    // 이미 선택된 버튼을 다시 클릭한 경우 선택 해제
    const newValue = selectedValue === value ? null : value;
    setSelectedValue(newValue);

    // AG Grid 데이터 업데이트
    if (props.node && props.column) {
      props.node.setDataValue(props.column.getColId(), newValue);
    }
  };

  return (
    <div className="h-full flex items-center space-x-2">
      <EvaluationButton
        value={0}
        isSelected={selectedValue === 0}
        onClick={handleClick}
      />
      <EvaluationButton
        value={0.5}
        isSelected={selectedValue === 0.5}
        onClick={handleClick}
      />
      <EvaluationButton
        value={1}
        isSelected={selectedValue === 1}
        onClick={handleClick}
      />
    </div>
  );
};

export default EvaluationRenderer;
