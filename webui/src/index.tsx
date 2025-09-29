import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store/appStore';
import './styles/globals.css';

const rootEl = document.getElementById('root');

if (rootEl) {
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
