import { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

interface ButtonProps {
  className?: string; // 추가 클래스 속성
  mode?: "primary" | "secondary"; // 버튼 스타일 모드
  disabled?: boolean; // 버튼 비활성화 여부
  isLoading?: boolean; // 로딩 상태 표시 여부
  onClick?: () => void; // 클릭 이벤트 핸들러
  preventDefault?: boolean; // 기본 이벤트 방지 여부
  stopPropagation?: boolean; // 이벤트 전파 방지 여부
  children?: ReactNode; // 버튼 내부 콘텐츠
}

function Button({
  className = "",
  mode = "primary",
  disabled = false,
  isLoading = false,
  onClick,
  preventDefault = true,
  stopPropagation = true,
  children,
}: ButtonProps) {
  // 기본 클래스
  const baseClasses = `flex items-center justify-center w-28 h-9 p-2 text-sm font-pretendard tracking-wider rounded-lg transition-colors duration-200
  disabled:text-gray-400/60 disabled:bg-gray-200 disabled:border-gray-500 disabled:cursor-not-allowed 
  ${isLoading && !disabled ? "cursor-wait pointer-events-none" : ""}`;

  // 모드별 스타일 정의
  const modeStyles = {
    primary: `bg-primary-blue text-white border border-hover-blue
    ${!isLoading ? "hover:bg-hover-blue" : ""}`, // 기본 모드1: 파란색 배경, 흰색 텍스트
    secondary: `bg-white text-black border border-gray-200
    ${!isLoading ? "hover:bg-gray-100" : ""}`, // 기본 모드2: 흰색 배경, 검은색 텍스트
  };

  return (
    <button
      className={`${baseClasses} ${!disabled ? modeStyles[mode] : ""} ${className}`}
      disabled={disabled}
      onClick={(e) => {
        // 이벤트 처리 로직
        if (preventDefault) e.preventDefault(); // 기본 이벤트 방지
        if (stopPropagation) e.stopPropagation(); // 이벤트 버블링 방지
        if (!disabled && !isLoading) onClick?.(); // 비활성화나 로딩 상태가 아닐 때만 클릭 이벤트 실행
      }}>
      {isLoading && !disabled ? (
        <LoaderCircle className="w-5 h-5 animate-spin" strokeWidth={3} /> // 로딩 중 아이콘 표시
      ) : (
        children // 기본 상태에서는 자식 요소 표시
      )}
    </button>
  );
}

export default Button;
