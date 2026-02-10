import { useState } from 'react';

const NavItem = () => {
  const [builderHover, setBuilderHover] = useState(false);
  return (
    <a
      href="#"
      className="flex items-center px-2 py-1 text-sm font-extrabold text-neutral-700 hover:text-sky-700"
      onMouseEnter={() => setBuilderHover(true)}
      onMouseLeave={() => setBuilderHover(false)}
    >
      Builder
      <span className="ml-2">
        {builderHover ? (
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M5 13l5-5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M5 7l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </a>
  );
};

export default NavItem;
