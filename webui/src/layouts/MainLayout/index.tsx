import { Outlet, useNavigate } from 'react-router';

import logo from '@/assets/logo.svg';

import TopNavMenu from './TopNavMenu';

const MainLayout = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="h-16 w-full border-b border-neutral-200 bg-white">
        <div className="flex h-full items-center justify-between px-6 md:container md:mx-auto">
          <div className="flex items-center">
            <img src={logo} alt="App Logo" className="mr-3 h-10 w-10" />
            <span className="text-xl font-bold text-neutral-800">SkillViz</span>
          </div>
          <TopNavMenu />

          <div className="flex items-center">
            <button
              className="rounded-lg border border-neutral-300 bg-white px-6 py-2 font-bold text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
              onClick={() => navigate('/dashboard')}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default MainLayout;
