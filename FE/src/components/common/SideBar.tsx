import React from "react";

const SideBar: React.FC = () => {
  return (
    <div className="w-1/5 p-4">
      {/* 로고 또는 타이틀 영역 */}
      <div className="flex items-center justify-center mb-8 p-2">
        <h1 className="text-logo font-bold text-blue-600">S-PAT</h1>
      </div>
    </div>
  );
};

export default SideBar;
