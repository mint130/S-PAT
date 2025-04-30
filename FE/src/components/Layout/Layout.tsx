import React, { ReactNode } from "react";
import Sidebar from "../common/SideBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="h-screen w-full bg-background flex justify-between">
        <Sidebar />
        <div className="w-4/5 rounded-xl bg-gradient-to-b from-white to-blue-100 shadow-lg flex flex-col justify-start m-2">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
