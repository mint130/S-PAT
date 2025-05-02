import { MessageSquare, Sparkles, ShieldAlert } from "lucide-react";

type FeatureItemProps = {
  title: string;
  items: string[];
};

const FeatureItem: React.FC<FeatureItemProps> = ({ title, items }) => {
  return (
    <div className="flex flex-col items-center p-2">
      <div className="mb-1">
        {title === "Applications" && (
          <div className="w-12 h-12 flex items-center justify-center rounded-lg text-primary-gray">
            <MessageSquare size={24} strokeWidth={1.5} />
          </div>
        )}
        {title === "Capabilities" && (
          <div className="w-12 h-12 flex items-center justify-center rounded-lg text-primary-gray">
            <Sparkles size={24} strokeWidth={1.5} />
          </div>
        )}
        {title === "Limitations" && (
          <div className="w-12 h-12 flex items-center justify-center rounded-lg text-primary-gray">
            <ShieldAlert size={24} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <h3 className="font-samsungSharp text-primary-gray mb-2 text-base">
        {title}
      </h3>

      <ul className="space-y-2 w-full">
        {items.map((item, index) => (
          <li
            key={index}
            className="p-2 text-xs max-w-[300px] text-primary-black border border-gray-200 rounded-md text-center font-samsung400 mx-auto bg-white">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const IntroContent: React.FC = () => {
  const applicationItems = [
    "기술 분야별 맞춤형 특허 분류 체계 생성",
    "연구 개발 트렌드 분석을 위한 특허 분류",
    "기업 특허 포트폴리오 관리 및 경쟁사 분석",
  ];

  const capabilityItems = [
    "LLM 기반 특허 분류 체계 자동 생성",
    "표준 분류 코드(IPC, CPC 등) 기반 맞춤형 체계 구축",
    "다양한 산업 및 기술 분야의 특허 분류 지원",
  ];

  const limitationItems = [
    "하나의 특허 파일만 업로드 가능합니다",
    "긴 대화는 사용량 제한에 더 빨리 도달할 수 있습니다",
    "특정 전문 분야에서는 분류 정확도가 다를 수 있습니다",
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-16 flex flex-col justify-center grow">
      <div className="text-center ">
        <h1 className="text-3xl font-samsungSharp font-bold text-primary-black mb-6">
          <span className="text-primary-blue">S</span>amsung{" "}
          <span className="text-primary-blue">P</span>atent{" "}
          <span className="text-primary-blue">A</span>I{" "}
          <span className="text-primary-blue">T</span>echnology
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-12">
        <FeatureItem title="Applications" items={applicationItems} />
        <FeatureItem title="Capabilities" items={capabilityItems} />
        <FeatureItem title="Limitations" items={limitationItems} />
      </div>
    </div>
  );
};

export default IntroContent;
