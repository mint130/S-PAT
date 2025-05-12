import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import useLLMStore from "../../stores/useLLMStore";
import { ChartColumn } from "lucide-react";

// Props 타입 정의
interface LLMBarChartProps {
  title: string;
  dataKey: "similarity" | "llmEval" | "expert";
  unit?: string;
  color?: string;
  barSize?: number;
  height?: number;
}

function LLMBarChart({
  title,
  dataKey,
  unit = "점",
  color = "#000000",
  barSize = 30,
  height,
}: LLMBarChartProps) {
  // Zustand 스토어에서 데이터 가져오기
  const llmData = useLLMStore((state) => state.llmData);
  const selectedLLM = useLLMStore((state) => state.selectedLLM);

  // 차트 데이터 준비 (선택된 LLM에 따라 색상 조정)
  const chartData = llmData.map((item) => ({
    name: item.name,
    [dataKey]: item[dataKey] * 100,
    // 선택된 LLM이 없거나 현재 항목이 선택된 경우 원래 색상, 아니면 흐린 색상
    color: !selectedLLM || selectedLLM === item.name ? color : "#E0E0E0",
  }));

  // X축 커스텀 틱 컴포넌트
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const isActive = !selectedLLM || selectedLLM === payload.value;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={isActive ? "#000000" : "#9CA3AF"}
          fontFamily="Pretendard"
          fontSize={12}>
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* 제목 */}
      <div className="flex space-x-2">
        <ChartColumn size={20} />
        <div className="font-pretendard font-semibold mb-2 text-sm">
          {title}
        </div>
      </div>
      {/* 차트 */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm flex-1 flex items-center justify-center py-2">
        <BarChart
          width={360}
          height={height || 180}
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: -5 }}>
          <CartesianGrid strokeDasharray="1 3" stroke="#C9C9C9" />
          <XAxis
            dataKey="name"
            tickLine={false} // X축 틱 마크 제거
            tick={<CustomXAxisTick />} // 커스텀 틱 컴포넌트 사용
          />
          <YAxis
            tickCount={5} // 틱 개수 조정
            tick={{
              fontSize: 12, // Y축 레이블은 항상 검은색
              fontFamily: "Pretendard",
              fill: "#000000",
            }}
          />
          <Tooltip
            formatter={(value) => {
              const numValue = Number(value);
              if (isNaN(numValue)) {
                return [value, title];
              }
              return [`${numValue.toFixed(1)}${unit}`, title];
            }}
            contentStyle={{
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff", // 배경색을 명시적으로 흰색으로 설정
              fontFamily: "Pretendard",
              fontSize: "12px",
              padding: "8px",
            }}
            cursor={{ fill: "transparent" }} // 호버 시 회색 영역 제거
          />
          <Bar
            dataKey={dataKey}
            barSize={barSize}
            fill={color}
            // 바 색상 커스터마이징
            fillOpacity={1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
}

export default LLMBarChart;
