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
import useThemeStore from "../../stores/useThemeStore";
import { ChartColumn } from "lucide-react";

// LLM 이름 포맷팅 함수 추가
const formatLLMName = (name: string) => {
  // 대문자 이름을 첫 글자만 대문자로 변환
  if (name === "GPT") return "GPT"; // GPT는 그대로 표시
  return name.charAt(0) + name.slice(1).toLowerCase();
};

// Props 타입 정의
interface LLMBarChartProps {
  title: string;
  dataKey: "vector_accuracy" | "reasoning_score" | "expert";
  unit?: string;
  color?: string;
  barSize?: number;
  height?: number;
  expertSkipped?: boolean; // 전문가 평가 스킵 여부
}

function LLMBarChart({
  title,
  dataKey,
  unit = "점",
  color = "#000000",
  barSize = 30,
  height,
  expertSkipped = false, // 전문가 평가 스킵 여부
}: LLMBarChartProps) {
  // Zustand 스토어에서 데이터 가져오기
  const llmData = useLLMStore((state) => state.llmData);
  const selectedLLM = useLLMStore((state) => state.selectedLLM);
  const { isDarkMode } = useThemeStore();

  // 차트 데이터 준비 (선택된 LLM에 따라 색상 조정)
  const chartData = llmData.map((item) => ({
    name: item.name, // 내부 비교용 원래 이름(대문자)
    displayName: formatLLMName(item.name), // 표시용 이름(첫 글자만 대문자)
    [dataKey]: item[dataKey] * 100,
    // selectedLLM과 item.name 모두 이미 대문자이므로 직접 비교
    color:
      !selectedLLM || selectedLLM === item.name
        ? color
        : isDarkMode
        ? "#4B5563"
        : "#E0E0E0", // 다크모드에서는 더 진한 회색
  }));

  // X축 커스텀 틱 컴포넌트
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;

    // payload.value는 원래 이름(대문자), 해당 항목의 displayName 찾기
    const currentItem = chartData.find((item) => item.name === payload.value);
    const displayName = currentItem ? currentItem.displayName : payload.value;

    // selectedLLM과 payload.value 비교 (원래 로직 유지)
    const isActive = !selectedLLM || selectedLLM === payload.value;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={
            isActive
              ? isDarkMode
                ? "#E5E7EB"
                : "#000000"
              : isDarkMode
              ? "#6B7280"
              : "#9CA3AF"
          }
          fontFamily="Pretendard"
          fontSize={12}>
          {displayName}
        </text>
      </g>
    );
  };

  // 제목 섹션
  const titleSection = (
    <div className="flex space-x-2">
      <ChartColumn size={20} className="text-gray-900 dark:text-gray-100" />
      <div className="font-pretendard font-semibold mb-2 text-sm text-gray-900 dark:text-gray-100">
        {title}
      </div>
    </div>
  );

  // expertSkipped가 true이고 dataKey가 'expert'인 경우에만 메시지 표시
  if (expertSkipped && dataKey === "expert") {
    return (
      <div className="flex flex-col h-full">
        {titleSection}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#23283D] shadow-sm flex-1 flex flex-col items-center justify-center py-2">
          <div className="text-gray-500 dark:text-gray-400 font-pretendard text-sm">
            전문가 평가는 생략되었습니다.
          </div>
        </div>
      </div>
    );
  }

  // 기존 차트 렌더링
  return (
    <div className="flex flex-col h-full">
      {titleSection}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#23283D] shadow-sm flex-1 flex items-center justify-center py-2">
        <BarChart
          width={360}
          height={height || 180}
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: -5 }}>
          <CartesianGrid
            strokeDasharray="1 3"
            stroke={isDarkMode ? "#4B5563" : "#C9C9C9"}
          />
          <XAxis dataKey="name" tickLine={false} tick={<CustomXAxisTick />} />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickCount={6}
            tick={{
              fontSize: 12,
              fontFamily: "Pretendard",
              fill: isDarkMode ? "#E5E7EB" : "#000000",
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
            labelFormatter={(name) => {
              // 툴팁에도 형식이 변경된 이름 표시
              const currentItem = chartData.find((item) => item.name === name);
              return currentItem ? currentItem.displayName : name;
            }}
            contentStyle={{
              borderRadius: "4px",
              border: isDarkMode ? "1px solid #4B5563" : "1px solid #e2e8f0",
              backgroundColor: isDarkMode ? "#2A2F45" : "#ffffff",
              color: isDarkMode ? "#FFFFFF" : "#000000",
              fontFamily: "Pretendard",
              fontSize: "12px",
              padding: "8px",
            }}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey={dataKey} barSize={barSize} fill={color} fillOpacity={1}>
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
