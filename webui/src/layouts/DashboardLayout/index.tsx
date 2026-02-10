import { useAuth } from 'react-oidc-context';
import { Outlet } from 'react-router';
import TopBar from './TopBar';

import logo from '../../assets/logo.svg';

const DashboardLayout = () => {
  const auth = useAuth();
  const handleLogout = () => {
    auth.signoutRedirect();
  };
  return (
    <>
      <TopBar
        userEmail={auth.user?.profile.email}
        onLogout={handleLogout}
        logo={logo}
      />
      {!auth.isAuthenticated && (
        <div style={{ padding: 24 }}>
          <button
            onClick={() => {
              auth.signinRedirect();
            }}
          >
            Login
          </button>
        </div>
      )}
      <Outlet />
      <footer className="mt-8 w-full border-t border-neutral-200 bg-white py-4 text-center text-sm text-neutral-500">
        © 2025 SkillViz. All rights reserved.
      </footer>
    </>
  );
};

export default DashboardLayout;
