import { withAuthenticationRequired } from 'react-oidc-context';
import { Outlet } from 'react-router';

interface Props {
  isPublic?: boolean;
  isAuthorized?: boolean;
}

const ProtectedRoute = ({ isPublic = false, isAuthorized = false }: Props) => {
  const canAccess = isPublic || isAuthorized;
  if (!canAccess) {
    // Before redirecting, store the page in sessionStorage
    sessionStorage.setItem('returnUrl', window.location.href);
  }
  const currentUrl = window.location.href;
  const ProtectedOutlet = withAuthenticationRequired(Outlet, {
    OnRedirecting: () => <div>Redirecting to the login page...</div>,
    signinRedirectArgs: { state: { returnUrl: currentUrl } },
  });

  return canAccess ? <Outlet /> : <ProtectedOutlet />;
};

export default ProtectedRoute;
