import React from "react";
import { LoaderCircle } from "lucide-react";

// 타입 정의 개선
type ButtonVariant = "primary" | "outline" | "dark-outline";
type ButtonSize = "sm" | "md" | "lg";
type TextSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; // 버튼 색상
  size?: ButtonSize; // 버튼 크기
  textSize?: TextSize; // 텍스트 크기
  isLoading?: boolean; // 로딩 상태 표시 여부
  icon?: React.ReactNode; // 아이콘
}

function Button({
  variant = "primary",
  size = "md",
  textSize = "sm",
  disabled = false,
  isLoading = false,
  icon,
  children,
  className = "",
  ...props // 나머지 모든 속성들 (onClick 포함)
}: ButtonProps) {
  // 기본 클래스
  const baseClasses = `flex items-center justify-center border font-pretendard tracking-wider rounded-lg whitespace-nowrap ${
    isLoading
      ? "cursor-wait"
      : "disabled:opacity-50 disabled:cursor-not-allowed"
  }`;

  // 버튼 색상 스타일
  const variantStyles: Record<ButtonVariant, string> = {
    primary: `bg-primary-blue text-white border-hover-blue ${
      !disabled && !isLoading ? "hover:bg-hover-blue" : ""
    }`, // 파란색 배경, 흰색 텍스트
    outline: `bg-white text-black border-gray-200 ${
      !disabled && !isLoading ? "hover:bg-gray-100" : ""
    }`, // 흰색 배경, 검은색 텍스트
    "dark-outline": `bg-[#23283D] text-[#E3E7ED] border-[#4B5268] ${
      !disabled && !isLoading ? "hover:bg-[#2A3048]" : ""
    }`, // 검은 배경, 흰색 텍스트
  };

  // 버튼 크기 스타일
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-2 py-1.5", // 작은 크기 (콘텐츠에 맞춤)
    md: "w-28 h-8 p-2", // 중간 크기 (표준)
    lg: "w-full px-2 py-2.5", // 큰 크기 (전체 너비)
  };

  // 텍스트 크기 스타일
  const textSizeStyles: Record<TextSize, string> = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${textSizeStyles[textSize]} ${className}`}
      disabled={disabled || isLoading}
      {...props}>
      <div className="relative flex items-center justify-center w-full">
        {/* 원래 콘텐츠 (항상 존재하지만 로딩 중일 때는 투명하게 처리) */}
        <div
          className={`flex items-center justify-center ${
            isLoading ? "invisible" : "visible"
          }`}>
          {icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
          {children}
        </div>

        {/* 로딩 인디케이터 (로딩 중일 때만 표시) */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoaderCircle className="w-4 h-4 animate-spin" strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  );
}

export default Button;
