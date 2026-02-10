import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store/appStore';
import { setRuntimeApiConfig } from './runtime/apiRuntime';
import './styles/globals.css';

async function bootstrap(): Promise<void> {
  if (window.api?.getRuntimeConfig) {
    try {
      const runtimeConfig = await window.api.getRuntimeConfig();
      setRuntimeApiConfig(runtimeConfig);
    } catch (error) {
      console.warn('Failed to load runtime API config from desktop host:', error);
    }
  }

  const rootEl = document.getElementById('root');

  if (!rootEl) {
    return;
  }

  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        {/* <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}> */}
        <App />
        {/* </AuthProvider> */}
      </Provider>
    </React.StrictMode>,
  );
}

void bootstrap();
