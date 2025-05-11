import React from "react";
import Sidebar from "../common/SideBar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <>
      <div className="h-screen w-full bg-background flex justify-between">
        <Sidebar />
        <div className="w-5/6 rounded-xl relative overflow-hidden shadow-lg flex flex-col justify-start m-2">
          <div className="absolute inset-0 bg-white"></div>

          {/* 배경 효과 요소 - 하단 40% */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 opacity-10 blur-412 overflow-hidden">
            <div className="absolute inset-0 bg-mask"></div>

            <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-gradient-radial from-element1-from to-element1-to"></div>

            <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-element2 opacity-68 blur-310"></div>

            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-element3 blur-377 mix-blend-overlay"></div>

            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-element4 blur-377 mix-blend-overlay"></div>

            <div className="absolute bottom-1/3 right-1/2 w-56 h-56 rounded-full bg-element5 opacity-70 blur-133 mix-blend-darken"></div>
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
