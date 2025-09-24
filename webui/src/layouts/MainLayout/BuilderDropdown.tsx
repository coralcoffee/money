import React from 'react';

interface BuilderDropdownProps {
  visible: boolean;
}

const BuilderDropdown: React.FC<BuilderDropdownProps> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="absolute z-50 left-[-8px] top-[12px] w-[100px] h-[150px] bg-white rounded-xl shadow-lg border border-neutral-200 flex flex-col justify-center items-center p-4">
      <span className="font-bold text-sm mb-2">Builder Menu</span>
      <ul className="w-full text-xs text-neutral-700">
        <li className="py-1 hover:text-sky-700 cursor-pointer">Resume Builder</li>
        <li className="py-1 hover:text-sky-700 cursor-pointer">Cover Letter</li>
        <li className="py-1 hover:text-sky-700 cursor-pointer">CV Maker</li>
      </ul>
    </div>
  );
};

export default BuilderDropdown;
