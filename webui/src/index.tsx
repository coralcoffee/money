import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from 'react-oidc-context';
import App from './App';
import oidcConfig, { onSigninCallback } from './oidcConfig';
import './styles/globals.css';

const rootEl = document.getElementById('root');

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>,
  );
}
