import React from 'react';

export const GridLines: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] flex justify-center w-full max-w-[1600px] mx-auto px-8 md:px-16" aria-hidden="true">
      <div className="w-full flex justify-between h-full border-x border-[#1A1A1A]/10">
        <div className="w-1/3 border-r border-[#1A1A1A]/10 h-full hidden md:block"></div>
        <div className="w-1/3 border-r border-[#1A1A1A]/10 h-full hidden md:block"></div>
        <div className="w-1/3 h-full hidden md:block"></div>
      </div>
    </div>
  );
};
