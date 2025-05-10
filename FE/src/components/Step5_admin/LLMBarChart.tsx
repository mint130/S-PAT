import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import useLLMStore from "../../stores/useLLMStore";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

// Props 타입 정의
interface LLMBarChartProps {
  title: string;
  dataKey: "similarity" | "llmEval" | "expert";
  unit?: string;
  color?: string;
  barSize?: number;
}

function LLMBarChart({
  title,
  dataKey,
  unit = "점",
  color = "#000000",
  barSize = 30,
}: LLMBarChartProps) {
  // Zustand 스토어에서 데이터 가져오기
  const llmData = useLLMStore((state) => state.llmData);

  // 차트 데이터 준비
  const chartData = llmData.map((item) => ({
    name: item.name,
    [dataKey]: item[dataKey] * 100,
  }));

  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <div className="flex space-x-2">
        <ChartNoAxesColumnIncreasing />
        <div className="text-pretendard font-extrabold  mb-2">{title}</div>
      </div>
      {/* 차트 */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <BarChart
          width={360}
          height={210}
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="1 3" stroke="#C9C9C9" />
          <XAxis
            dataKey="name"
            tickLine={false} // X축 틱 마크 제거
          />
          <YAxis
            tickCount={6} // 틱 개수 조정
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
            }}
          />
          <Bar dataKey={dataKey} fill={color} barSize={barSize} />
        </BarChart>
      </div>
    </div>
  );
}

export default LLMBarChart;
