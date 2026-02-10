import React, { useState } from 'react';

interface TopBarProps {
  userEmail?: string;
  onLogout?: () => void;
  logo: string;
}

const TopBar: React.FC<TopBarProps> = ({ userEmail, onLogout, logo }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-16 w-full border-b border-neutral-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center">
          <img src={logo} alt="App Logo" className="mr-3 h-10 w-10" />
          <span className="text-xl font-bold text-neutral-800">SkillViz</span>
        </div>
        <div className="relative">
          <div
            className="flex cursor-pointer items-center"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="mr-2">{userEmail}</span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#eee" />
              <text x="16" y="21" textAnchor="middle" fontSize="16" fill="#888">
                👤
              </text>
            </svg>
          </div>
          {menuOpen && (
            <div className="absolute top-10 right-0 z-10 min-w-[120px] rounded-lg bg-white shadow-lg">
              <button
                className="w-full rounded-lg px-4 py-2 text-left hover:bg-neutral-100"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
