import { User } from 'oidc-client-ts';

const oidcConfig = {
  authority: process.env.PUBLIC_AUTHORITY ?? '',
  client_id: process.env.PUBLIC_CLIENT_ID ?? 'WebUI',
  redirect_uri: `${window.location.origin}`,
  post_logout_redirect_uri: `${window.location.origin}`,
  response_type: 'code',
  scope: 'openid profile email offline_access SkillViz',
  automaticSilentRenew: true,
  loadUserInfo: true,
};

const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.origin === window.location.origin;
  } catch {
    return false;
  }
};
const onSigninCallback = (user: User | void): void => {
  try {
    if (!user) {
      window.location.href = '/';
      return;
    }

    let returnUrl = '/';

    if (user.state && typeof user.state === 'object') {
      const state = user.state as Record<string, unknown>;
      if ('returnUrl' in state && typeof state.returnUrl === 'string') {
        const candidateUrl = state.returnUrl;

        if (isValidUrl(candidateUrl)) {
          returnUrl = candidateUrl;
        } else {
          console.warn(
            'onSigninCallback: Invalid return URL detected, using default:',
            candidateUrl,
          );
        }
      }
    }

    const sessionReturnUrl = sessionStorage.getItem('returnUrl');
    if (!returnUrl || returnUrl === '/') {
      if (sessionReturnUrl && isValidUrl(sessionReturnUrl)) {
        returnUrl = sessionReturnUrl;
      }
    }

    sessionStorage.removeItem('returnUrl');

    console.log('onSigninCallback: Redirecting to:', returnUrl);

    if (returnUrl.startsWith('/')) {
      window.history.replaceState({}, document.title, returnUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.href = returnUrl;
    }
  } catch (error) {
    console.error('onSigninCallback: Error during callback processing:', error);
    window.location.href = '/';
  }
};
export default oidcConfig;
export { onSigninCallback };
