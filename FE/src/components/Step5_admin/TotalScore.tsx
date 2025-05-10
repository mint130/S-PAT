import { Crown } from "lucide-react";

const TotalScore = () => {
  // 임시 데이터 - 실제로는 props나 상태로 받아와야 함

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-pretendard font-extrabold mb-2 flex items-center">
        <span className="mr-2">
          <Crown size={16} />
        </span>
        종합 점수
      </h3>
      <div className="bg-white p-4 rounded-lg shadow-sm flex-1 flex items-center justify-center"></div>
    </div>
  );
};

export default TotalScore;
