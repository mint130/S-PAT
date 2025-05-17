import React from "react";
import Sidebar from "../common/SideBar";
import { Outlet } from "react-router-dom";
import useThemeStore from "../../stores/useThemeStore";

const Layout: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <div className="h-screen w-full bg-background dark:bg-[#23283D] flex justify-between">
        <Sidebar />
        <div className="w-5/6 rounded-xl relative overflow-hidden shadow-lg flex flex-col justify-start m-2">
          <div className="absolute inset-0 bg-white dark:bg-[#141828]"></div>

          {/* 배경 효과 요소 - 하단 40% */}
          <div
            className={`absolute inset-x-0 bottom-0 h-1/3 ${
              isDarkMode ? "opacity-30" : "opacity-10"
            } blur-412 overflow-hidden`}>
            {/* 다크 모드에서는 다른 마스크 효과 */}
            <div className="absolute inset-0 bg-mask dark:bg-[#2388FF]"></div>

            {/* Element 1: Radial Gradient - 다크 모드에서 더 강조 */}
            <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-gradient-radial from-element1-from to-element1-to dark:from-[#0679FF] dark:to-[#2A8CFF]"></div>

            {/* 다른 요소들은 다크 모드에서 투명도 감소 또는 제거 */}
            <div
              className={`absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-element2 ${
                isDarkMode ? "opacity-40" : "opacity-68"
              } blur-310`}></div>

            <div
              className={`absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-element3 blur-377 mix-blend-overlay ${
                isDarkMode ? "hidden" : ""
              }`}></div>

            <div
              className={`absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-element4 blur-377 mix-blend-overlay ${
                isDarkMode ? "hidden" : ""
              }`}></div>

            <div
              className={`absolute bottom-1/3 right-1/2 w-56 h-56 rounded-full bg-element5 opacity-70 blur-133 mix-blend-darken ${
                isDarkMode ? "hidden" : ""
              }`}></div>
          </div>

          {/* 실제 콘텐츠 */}
          <div className="relative z-10 w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
