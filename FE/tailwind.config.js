/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minWidth: {
        app: "510px",
      },
      // 배경 그라데이션 설정
      opacity: {
        10: "0.1",
        68: "0.68",
        70: "0.70",
      },
      blur: {
        133: "133.11px",
        310: "310.59px",
        377: "377.15px",
        412: "412.22px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        transparent: "transparent",
        black: "#000000",
        white: "#FFFFFF",

        background: "#F7F8FA", // 배경색

        "primary-black": "#282858", // 주 사용 검은색
        "primary-gray": "#666F8D", // 주 사용 회색
        "primary-blue": "#4461F2", // 주 사용 파란색

        "hover-blue": "#425DE0",

        // 선택된 박스
        "select-box": "#F6FAFF",
        "select-box-border": "#B8D8FF", // 선택된 박스의 border
        "select-box-icon": "#64A7FF", // 선택된 박스의 border hover

        // LLM 모델 색
        GPT: "#000000",
        Claude: "#D77757",
        Gemini: "#3693DA",
        Grok: "#999999",

        // 배경 요소 색상 추가
        mask: "#2388FF",
        "element1-from": "#0679FF",
        "element1-to": "#2A8CFF",
        element2: "#5344FE",
        element3: "#FE445A",
        element4: "#D74D12",
        element5: "#AC0CB9",
      },
      mixBlendMode: {
        overlay: "overlay",
        darken: "darken",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        samsung400: ["Samsung400", "sans-serif"],
        samsung700: ["Samsung700", "sans-serif"],
        samsungSharp: ["SamsungSharp", "sans-serif"],
      },
      fontSize: {
        logo: [
          "45px", // 로고 글자 크기
          {
            lineHeight: "54px",
            letterSpacing: "-0.3px",
          },
        ],
        title: [
          "24px", // 타이틀 크기
          {
            lineHeight: "34px",
            letterSpacing: "-0.3px",
          },
        ],
        subtitle: [
          "15px", // 서브 타이틀 크기
          {
            lineHeight: "24px",
            letterSpacing: "-0.2px",
          },
        ],
        "table-title": [
          "18px", // 테이블 타이틀 크기
          {
            lineHeight: "26px",
            letterSpacing: "-0.2px",
          },
        ],
        "table-subtitle": [
          "12px", // 테이블 서브 타이틀 크기
          {
            lineHeight: "16px",
            letterSpacing: "0px",
          },
        ],
        "table-content": [
          "14px", // 테이블 내용 크기
          {
            lineHeight: "20px",
            letterSpacing: "-0.1px",
          },
        ],
      },
      // fontWeight: {
      //   "p-700": "700", // h1~h5였음
      //   "p-500": "500", // medium, subtitle
      //   "p-400": "400",
      //   "p-800": "800",
      // },
      boxShadow: {
        sm: "0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.2)",
        md: "0 0.125rem 0.625rem rgba(0, 0, 0, 0.2)",
        lg: "0 0.25rem 1rem rgba(0, 0, 0, 0.2)",
        xl: "0 1rem 2rem rgba(0, 0, 0, 0.2)",
      },
      keyframes: {
        drift: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        // 블렌드 모드 유틸리티
        ".mix-blend-overlay": {
          "mix-blend-mode": "overlay",
        },
        ".mix-blend-darken": {
          "mix-blend-mode": "darken",
        },
      });
    },
  ],
};
