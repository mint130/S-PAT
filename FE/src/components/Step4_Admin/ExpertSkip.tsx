interface ExpertSkipProps {
  onSkipClick: () => void;
}

function ExpertSkip({ onSkipClick }: ExpertSkipProps) {
  return (
    <button
      className="font-pretendard text-primary-blue hover:text-blue-800"
      onClick={onSkipClick}>
      건너뛰기
    </button>
  );
}

export default ExpertSkip;
